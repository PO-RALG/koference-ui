import { computed, onMounted, reactive, watch } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import {
  addBalance,
  confirmReport,
  getEntries,
  getReport,
  reconcileEntries as reconcile,
  unlock as unlockReport,
} from "../services/bank-reconciliation-service";
import { Params } from "../types";
import moment from "moment";
import sortBy from "lodash/sortBy";

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
    showConfirm: false,
    showBalance: true,
    rows: ["10", "20", "50", "60", "100"],
    headers: [
      { text: "Date", value: "date" },
      { text: "Ref Number", value: "reference_no" },
      { text: "Bank Ref Number", value: "bank_reference_number" },
      { text: "Description", value: "description", sortable: false },
      { text: "Reconciled", value: "status", sortable: false },
      { text: "Type", value: "type", sortable: false },
      { text: "DR", align: "right", sortable: true, value: "dr_amount" },
      { text: "CR", align: "right", sortable: true, value: "cr_amount" },
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
    const bankAccountId = root.$route.query.bank_account_id
      ? root.$route.query.bank_account_id
      : null;
    const params = {
      date: date,
      bank_account_id: bankAccountId,
      per_page: 10000,
    };
    const query = {
      ...params,
    };

    data.selectedEntries = [];
    if (date && bankAccountId) {
      data.formData.bank_account_id = parseInt(bankAccountId);
      data.formData.date = date;
      init(query);
    } else {
      await openDialog("LOAD");
    }
  };

  watch(
    () => root.$route.query,
    async (newQuery) => {
      const { bank_account_id, date } = newQuery;
      const params = { date, bank_account_id };
      if (!date && !bank_account_id) {
        await init(params);
      }
    }
  );

  const init = async (params: Params) => {
    if (params.bank_account_id && params.date) {
      const query = {
        ...params,
        per_page: 10,
      };
      getEntries(query)
        .then((response: AxiosResponse) => {
          ////: ", response);
          const { from, to, total, current_page, per_page, last_page } =
            response.data.data;
          data.response = {
            from,
            to,
            total,
            current_page,
            per_page,
            last_page,
          };
          data.entries = response.data.data.data;
        })
        .then(() => {
          /*      getReport(params).then((response: AxiosResponse) => {
                  if (response.data.data.balance_required) {
                    openDialog("BALANCE");
                  } else {
                    if (response.data.data.diff === 0) {
                      showConfirmDialog();
                    }
                  }
                });*/

          getReport(data.formData).then((response: AxiosResponse) => {
            if (response.data.data.balance_required) {
              data.dialog = !data.dialog;
              openDialog("BALANCE");
            } else {
              if (response.data.data.diff === 0) {
                //showConfirmDialog();
              }
              data.report = response.data.data;
              if (data.report.confirmed) {
                data.showEdit = false;
              } else {
                data.showEdit = true;
              }
              if (response.data.data.diff === 0) {
                data.showConfirm = true;
              } else {
                data.showConfirm = false;
              }
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

  const fetchData = async (params: any) => {
    const query = {
      ...params,
      date: root.$root.$route.query.date,
      bank_account_id: root.$root.$route.query.bank_account_id,
    };
    data.response = query;
    getEntries(query).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.entries = response.data.data.data;
    });
  };

  const openDialog = async (type: string) => {
    const date = root.$route.query.date ? root.$route.query.date : null;
    const bankAccountId = root.$route.query.bank_account_id
      ? root.$route.query.bank_account_id
      : null;
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
      const bankAccountId = root.$route.query.bank_account_id
        ? root.$route.query.bank_account_id
        : null;

      getEntries(data.formData)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            if (
              data.formData.bank_account_id !== bankAccountId ||
              data.formData.date !== date
            ) {
              root.$router.replace({
                query: {
                  date: data.formData.date,
                  bank_account_id: data.formData.bank_account_id,
                },
              });
            } else {
              return null;
            }
            const { from, to, total, current_page, per_page, last_page } =
              response.data.data;
            data.response = {
              from,
              to,
              total,
              current_page,
              per_page,
              last_page,
            };
            data.entries = response.data.data.data;
          }
        })
        .then(() => {
          getReport(data.formData).then((response: AxiosResponse) => {
            if (response.data.data.balance_required) {
              data.dialog = !data.dialog;
              openDialog("BALANCE");
            } else {
              if (response.data.data.diff === 0) {
                //showConfirmDialog();
              }
              data.report = response.data.data;
              if (data.report.confirmed) {
                data.showEdit = false;
              } else {
                data.showEdit = true;
              }
              if (response.data.data.diff === 0) {
                data.showConfirm = true;
              } else {
                data.showConfirm = false;
              }
            }
          });
        });
      data.dialog = !data.dialog;
    }
  };

  // parse comma separated string to float
  const parseStringToFloat = (value: string) => {
    return parseFloat(value.replace(/,/g, ""));
  };


  const updateBalance = () => {
    const payload = {
      balance: parseStringToFloat(data.report.bank_balance),
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

    unlockReport(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        data.isUnlockOpen = false;
        loadComponent();
      }
    });
  };

  const rowClicked = (item: any) => {
    data.formData.balance = data.report.bank_balance;
    if (item.confirmed) {
      //data.showEdit = false;
    } else {
      //data.showEdit = true;
    }
  };

  const currentDate = computed(() => {
    const date = new Date();
    return moment(date).format("YYYY-MM");
  });

  const getType = (transaction_type: string): string => {
    const type = transaction_type.split("\\")[2];
    return type;
    /*switch (type) {
      case "Payment":
        return "OUTSTANDING PAYMENTS";
      case "Receipt":
        return "OUTSTANDING DEPOSITS";
      default:
        return "NO TYPE";
    }*/
  };

  const getAccount = (transaction_type: string): string => {
    const type = transaction_type.split("\\")[2];
    switch (type) {
      case "Payment":
        return "AP";
      case "Receipt":
        return "AR";
      default:
        return "NO ACC";
    }
  };

  const title = computed(() => {
    const reportUnlocked = data.report ? data.report.confirmed : false;
    const title = reportUnlocked
      ? `Bank Reconciliation locked as of ${moment(data.report.month).format(
        "DD/MM/YYYY"
      )}`
      : data.title + ` - (${moment(data.formData.date).format("DD/MM/YYYY")})`;
    return title;
  });

  const getAmount = (entry) => {
    const dr = parseInt(entry.dr_amount);
    const cr = parseInt(entry.cr_amount);
    if (cr > dr) {
      return cr;
    } else {
      return dr;
    }
  };

  const entries = computed(() => {
    return sortBy(
      data.entries.map((entry: any) => {
        return {
          ...entry,
          type: getType(entry.transaction_type),
        };
      }),
      "date"
    ).reverse();
  });
  /*`${entry.owner?.name}`*/
  const reconcileEntry = (entry: any) => {
    const status = entry.item.is_reconciled ? false : true;
    const item = [{ id: entry.item.id, status: status }];
    const payload = {
      date: root.$root.$route.query.date,
      bank_account_id: root.$root.$route.query.bank_account_id,
      entries: item,
    };

    reconcile(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        loadComponent();
      }
    });
  };

  const selected = computed(() => {
    return data.entries.filter((entry) => {
      return entry.status === true;
    });
  });

  return {
    data,
    fetchData,
    openDialog,
    cancelDialog,
    currentDate,
    save,
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
    title,
    reconcileEntry,
    selected,
  };
};
