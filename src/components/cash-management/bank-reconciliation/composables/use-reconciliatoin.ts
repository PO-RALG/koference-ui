import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import { getEntries, addBalance } from "../services/bank-reconciliation-service";
import { Params } from "../types";
import moment from "moment";
import json from "../sample/json";

export const useBankReconciliation = ({ root }): any => {
  const data = reactive({
    entries: [],
    selectedEntries: [],
    valid: true,
    showSelect: true,
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
      { text: "PV Number", value: "number" },
      { text: "Date", value: "date" },
      { text: "Amount", align: "start", sortable: false, value: "amount" },
      { text: "Account", value: "account" },
      { text: "Cheque #", value: "annual_serial" },
      { text: "Status", value: "status", sortable: false },
    ],
    statuses: ["CREATED", "RECONCILED", "OUTSTANDING DEPOSITS", "OUTSTANDING PAYMENTS" ],
    balanceRules: [
      (v: string) => !!v || "Bank Balance is Required",
    ],

    accountRules: [
      (v: string) => !!v || "You must selecte a bank account",
    ],

    dateRules: [
      (v: string) => !!v || "You must selected a date",
    ],

    options: {
      precision: 2
    },
    date: new Date().toISOString().substr(0, 7),
    modal: false,
  });

  onMounted(() => {
    const date = root.$route.query.date ? root.$route.query.date : null;
    const bankAccountId = root.$route.query.bank_account_id ? root.$route.query.bank_account_id : null;
    const params = { date: date, bank_account_id: bankAccountId };
    if (date && bankAccountId) {
      init(params);
    }
  });

  const init = async (params: Params) => {
    getEntries(params).then((response: AxiosResponse) => {
      //data.entries = response.data.data;
      console.log("entries", json);
      data.entries = json;
    });
  };

  const fetchData = async () => {
    console.log("get data");
  };

  const reconcileEntries = (status: string) => {
    console.log("entry selected", status);
    console.log("selected entries:", data.selectedEntries);
  };

  const openDialog = async (type: string) => {
    if (type === "LOAD") {
      data.dialogTitle = "Select Entries Account & Date";
      data.showBalance = false;
      data.buttonTitle = "Load Entries"
    } else {
      data.dialogTitle = "Add Bank Balance";
      data.buttonTitle = "Save"
      data.showBalance = true;
    }
    data.dialog = !data.dialog;
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

    if (data.showBalance) {
      addBalance(data.formData).then((response: AxiosResponse) => {
        if (response.status === 200) {
          data.formData = { date: null, balance: null, bank_account_id: null };
          cancelDialog();
        }
      });
    } else {
      delete data.formData.balance;
      getEntries(data.formData).then((response: AxiosResponse) => {
        if (response.status === 200) {
          root.$router.replace({
            query: {
              date: data.formData.date,
              bank_account_id: data.formData.bank_account_id,
            },
          });
          data.entries = json;
          cancelDialog();
        }
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
