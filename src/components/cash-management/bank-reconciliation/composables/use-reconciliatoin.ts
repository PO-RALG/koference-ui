import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import { getEntries, addBalance, getReport, reconcileEntries as reconcile } from "../services/bank-reconciliation-service";
import { Params } from "../types";
import moment from "moment";
import json from "../sample/json";

export const useBankReconciliation = ({ root }): any => {
  const data = reactive({
    entries: [],
    selectedEntries: [],
    valid: true,
    showSelect: true,
    report: {},
    selectedDate: null,
    selectedBankAcc: null,
    response: {},
    formData: {
      date: null,
      balance: null,
      bank_account_id: null,
    },
    showReconciliationOptions: false,
    valueWhenEmpty: "",
    clearable: true,
    title: "Bank Reconciliation",
    dialogTitle: "",
    buttonTitle: "",
    dialog: false,
    showBalance: true,
    rows: ["10", "20", "50", "60", "100"],
    headers: [
      { text: "Ref Number", value: "reference_no" },
      { text: "Date", value: "date" },
      { text: "DR Amount", align: "start", sortable: false, value: "dr_amount" },
      { text: "CR Amount", align: "start", sortable: false, value: "cr_amount" },
      { text: "Status", value: "status", sortable: false },
    ],
    statuses: ["RECONCILE"],
    balanceRules: [(v: string) => !!v || "Bank Balance is Required"],

    accountRules: [(v: string) => !!v || "You must selecte a bank account"],

    dateRules: [(v: string) => !!v || "You must selected a date"],

    options: {
      precision: 2,
    },
    date: new Date().toISOString().substr(0, 7),
    modal: false,
  });

  onMounted(() => {
    const date = root.$route.query.date ? root.$route.query.date : null;
    const bankAccountId = root.$route.query.bank_account_id ? root.$route.query.bank_account_id : null;
    const params = { date: date, bank_account_id: bankAccountId };
    if (date && bankAccountId) {
      data.formData.bank_account_id = parseInt(bankAccountId);
      data.formData.date = date;
      init(params);
    }
  });

  const init = async (params: Params) => {
    getEntries(params)
      .then((response: AxiosResponse) => {
        data.entries = response.data.data;
      })
      .then(() => {
        getReport(params.bank_account_id, { date: params.date }).then((response: AxiosResponse) => {
          if (response.data.data.balance_required) {
            openDialog("BALANCE");
          } else {
            data.report = response.data.data;
          }
        });
      });
  };

  const fetchData = async () => {
    console.log("get data");
  };

  const reconcileEntries = () => {
    const entries = data.selectedEntries.map((entry) => {
      return {
        id: entry.id,
        status: true,
      }
    })
    const payload = {
      date: root.$root.$route.query.date,
      bank_account_id: root.$root.$route.query.bank_account_id,
      entries,
    }
    reconcile(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        console.log("response", response);
      }
    })
  };

  const openDialog = async (type: string) => {
    const date = root.$route.query.date ? root.$route.query.date : null;
    const bankAccountId = root.$route.query.bank_account_id ? root.$route.query.bank_account_id : null;
    data.formData.bank_account_id = parseInt(bankAccountId);
    data.formData.date = date;
    data.formData.balance = null;

    if (type === "LOAD") {
      data.dialogTitle = "Select Entries Account & Date";
      data.showBalance = false;
      data.buttonTitle = "Load Entries";
    } else {
      data.dialogTitle = "Add Bank Balance";
      data.buttonTitle = "Save";
      data.showBalance = true;
    }
    data.dialog = true;
  };

  const cancelDialog = async () => {
    data.formData = { date: null, balance: null, bank_account_id: null };
    data.dialog = !data.dialog;
  };

  const save = async () => {
    const dateInst = moment(data.formData.date);
    /**
     * adding 1 month from the present month and then subtracting 1 day,
     * So you would get the last day of this month
     */
    dateInst.add(1, "months").date(1).subtract(1, "days");
    /* printing the last day of this month's date */

    const date = dateInst.format("YYYY-MM-DD");

    data.formData.date = date;

    data.selectedDate = data.formData.date;
    data.selectedBankAcc = data.formData.bank_account_id;

    if (data.showBalance) {
      addBalance(data.formData).then((response: AxiosResponse) => {
        if (response.status === 200) {
          data.formData = { date: null, balance: null, bank_account_id: null };
          cancelDialog();
        }
      });
    } else {
      delete data.formData.balance;

      const date = root.$route.query.date ? root.$route.query.date : null;
      const bankAccountId = root.$route.query.bank_account_id ? root.$route.query.bank_account_id : null;

      getEntries(data.formData)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            if (data.formData.bank_account_id !== bankAccountId || data.formData.date !== date) {
              root.$router.replace({
                query: {
                  date: data.formData.date,
                  bank_account_id: data.formData.bank_account_id,
                },
              });
            } else {
              return null;
            }
            data.entries = response.data.data;
          }
        })
        .then(() => {
          getReport(data.formData.bank_account_id, { date: data.formData.date }).then((response: AxiosResponse) => {
            if (response.data.data.balance_required) {
              console.log("report", response.data.data);
              data.dialog = !data.dialog;
              openDialog("BALANCE");
            } else {
              data.report = response.data.data;
            }
          });
        });
    }
  };

  return {
    data,
    fetchData,
    openDialog,
    cancelDialog,
    save,
    reconcileEntries,
  };
};
