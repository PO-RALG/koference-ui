import { reactive, onMounted, computed, watch } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import {
  getEntries,
  addBalance,
  getReport,
  reconcileEntries as reconcile,
  confirmReport,
  unlock as unlockReport,
} from "../services/bank-reconciliation-service";
import { Params } from "../types";
import moment from "moment";
import router from "@/router";
import json from "../sample/json";

export const useBankReconciliation = ({ root }): any => {
  const data = reactive({
    entries: [],
    selectedEntries: [],
    valid: true,
    isOpen: false,
    isUnlockOpen: false,
    showSelect: true,
    singleSelect: true,
    report: null,
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
    showEdit: false,
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
    loadComponent();
  });

  const loadComponent = async () => {
    const date = root.$route.query.date ? root.$route.query.date : null;
    const bankAccountId = root.$route.query.bank_account_id ? root.$route.query.bank_account_id : null;
    const params = { date: date, bank_account_id: bankAccountId };
    data.selectedEntries = [];
    if (date && bankAccountId) {
      data.formData.bank_account_id = parseInt(bankAccountId);
      data.formData.date = date;
      init(params);
    }
  };

  watch(
    () => root.$route.query,
    async (newQuery) => {
      const { bank_account_id, date } = newQuery;
      const params = { date, bank_account_id };
      if (!date && !bank_account_id) {
        init(params);
      }
    }
  );

  const init = async (params: Params) => {
    if (params.bank_account_id && params.date) {
      getEntries(params)
        .then((response: AxiosResponse) => {
          data.entries = response.data.data;
        })
        .then(() => {
          getReport(params.bank_account_id, { date: params.date }).then((response: AxiosResponse) => {
            if (response.data.data.balance_required) {
              openDialog("BALANCE");
            } else {
              if (response.data.data.diff === 0) {
                showConfirmDialog();
              }
              data.report = response.data.data;
            }
          });
        });
    } else {
      data.entries = [];
      data.report = null;
    }
  };

  const showConfirmDialog = async () => {
    data.isOpen = true;
  };

  const closeConfirmDialog = () => {
    data.isOpen = false;
  };

  const closeUnlockDialog = () => {
    data.isUnlockOpen = false;
  };

  const openUnlockDialog = () => {
    data.isUnlockOpen = true;
  };

  const fetchData = async () => {
    console.log("get data");
  };

  const reconcileEntries = () => {
    const entries = data.selectedEntries.map((entry) => {
      return {
        id: entry.id,
        status: true,
      };
    });
    const payload = {
      date: root.$root.$route.query.date,
      bank_account_id: root.$root.$route.query.bank_account_id,
      entries,
    };
    reconcile(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        loadComponent();
      }
    });
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
          data.showEdit = false;
          data.formData = { date: null, balance: null, bank_account_id: null };
          cancelDialog();
          loadComponent();
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
              if (response.data.data.diff === 0) {
                showConfirmDialog();
              }
              data.report = response.data.data;
            }
          });
        });
      data.dialog = !data.dialog;
    }
  };

  const updateBalance = () => {
    const payload = {
      balance: data.report.bank_balance,
      date: root.$route.query.date,
      bank_account_id: root.$route.query.bank_account_id,
    };

    addBalance(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        data.showEdit = false;
        data.formData = { date: null, balance: null, bank_account_id: null };
        loadComponent();
      }
    });
  };

  const outstandingDeposits = computed(() => {
    const sum = data.entries.reduce((acc, entry) => {
      return acc + parseInt(entry.dr_amount);
    }, 0);
    return sum;
  });

  const outstandingPayments = computed(() => {
    const sum = data.entries.reduce((acc, entry) => {
      return acc + parseInt(entry.cr_amount);
    }, 0);
    return sum;
  });

  const diff = computed(() => {
    if (data.report) {
      return data.report.adjusted_balance - data.report.cash_balance;
    }
  });

  const confirmReconciliation = async (item: any) => {
    const payload = {
      ...data.report,
      bank_account_id: root.$root.$route.query.bank_account_id,
      date: root.$root.$route.query.date,
    };
    confirmReport(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        data.isOpen = false;
        loadComponent();
      }
    });
  };

  const unlock = async () => {
    const payload = {
      bank_account_id: root.$route.query.bank_account_id,
      start_date: root.$route.query.date,
    };
    console.log("payload", payload);

    unlockReport(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        loadComponent();
      }
    });
  };

  const rowClicked = (item: any) => {
    data.formData.balance = data.report.bank_balance;
    if (item.confirmed) {
      data.showEdit = false;
    } else {
      data.showEdit = true;
    }
  };

  const currentDate = computed(() => {
    const date = new Date();
    return moment(date).format("YYYY-MM");
  });

  const getType = (transaction_type: string): string => {
    const type = transaction_type.split("\\")[2];
    switch (type) {
      case "Payment":
        return "OUTSTANDING PAYMENTS";
      case "Receipt":
        return "OUTSTANDING DEPOSITS";
      default:
        return "NO TYPE";
    }
  };

  const entries = computed(() => {
    return data.entries.map((entry: any) => {
      return {
        ...entry,
        type: getType(entry.transaction_type),
      };
    });
  });

  return {
    data,
    fetchData,
    openDialog,
    cancelDialog,
    currentDate,
    save,
    reconcileEntries,
    outstandingDeposits,
    outstandingPayments,
    diff,
    showConfirmDialog,
    closeConfirmDialog,
    confirmReconciliation,
    closeUnlockDialog,
    openUnlockDialog,
    rowClicked,
    entries,
    unlock,
    updateBalance,
  };
};
