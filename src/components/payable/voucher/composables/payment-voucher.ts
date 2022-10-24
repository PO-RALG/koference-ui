import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  get,
  find,
  create,
  destroy,
  printPdf,
  fundByActivity,
  getWorkflow,
  fundByActivityFundSource,
  activitiesByFundSource,
  approvePVFacilityService,
} from "../services/payment-voucher.services";
import stringToCurrency from "@/filters/money-to-number";

import { get as getFundSources } from "@/components/coa/funding-source/services/funding-sources";
import {
  PaymentVoucher,
  Account,
  VOUCHER_TYPE,
  Payable,
} from "../types/PaymentVoucher";
import { get as getSupplier } from "@/components/payable/supplier/services/supplier.services";
import { get as getActivity } from "@/components/planning/activity/services/activity.service";
import { getBudget } from "@/components/payable/fund-allocation/services/fund-allocation.services";
import { Activity } from "@/components/planning/activity/types/Activity";
import { FundSources } from "@/components/coa/funding-source/types/index";
import moment from "moment";
import { RECEIPT_TYPE } from "@/components/receivables/receipt/types";
import { getGlAccounts } from "@/components/receivables/receipt/services/receipt-service";

export const usePaymentVoucher = (): any => {
  const dataItems: Array<PaymentVoucher> = [];
  const paymentVoucherData = {} as PaymentVoucher;
  const payables = []; //:Payable[]
  const activityItem = {} as Activity;
  const fundSourceItem = {} as FundSources;

  const data = reactive({
    title: "Payment Vouchers",
    selectedGfsCodes: null,
    valid: false,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Reference Number",
        align: "start",
        sortable: false,
        value: "reference_no",
        width: 200,
      },
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "date",
      },
      {
        text: "Supplier",
        align: "start",
        sortable: false,
        value: "supplier.name",
      },
      {
        text: "Amount",
        align: "start",
        sortable: false,
        value: "amount",
      },
      {
        text: "Amount Paid",
        align: "start",
        sortable: false,
        value: "amount_paid",
      },
      {
        text: "Status",
        align: "start",
        sortable: false,
        value: "full_paid",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
        width: 450,
      },
      {
        text: "Approve Status",
        align: "start",
        sortable: false,
        value: "approve",
        // value: "approve.facility_approved",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    modal: false,
    deletemodal: false,
    genericConfirmModel: false,
    items: dataItems,
    itemsToFilter: [],
    formData: paymentVoucherData,
    genericDialogAction: null,
    payables: payables,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    searchTerm: "",
    activityItem: activityItem,
    fundSourceItem: fundSourceItem,
    suppliers: [],
    activities: [],
    gfsCodes: [],
    fundingSources: [],
    accounts: [],
    coat: "/coat_of_arms.svg.png",
    pvDetails: { printDate: "" },
    paymentVoucherModal: false,
    voucherType: VOUCHER_TYPE.NORMAL,
    depositAccounts: [],
    selectedActivity: null,
  });

  onMounted(() => {
    getTableData();

    // getWorkflow(data.params).then((response: AxiosResponse) => {
    //   const sendJson = JSON.stringify(response.data);
    //   localStorage.setItem("WORK_FLOW", sendJson);
    // });
  });

  const filterVoucher = () => {
    if (data.searchTerm.length > 3) {
      get({ regSearch: data.searchTerm }).then((response: AxiosResponse) => {
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
        data.items = response.data.data.data;
      });
    }
    if (data.searchTerm.length === 0 || data.searchTerm === null) {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
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
        data.items = response.data.data.data;
      });
    }
  };

  const resetSearchText = () => {
    data.searchTerm = "";
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      // data.items = response.data.data.data;
      data.items = response.data.data.data.map((approve: any) => ({
        ...approve,
        approve: approve.approves.find(
          (flow) => flow.workflow == "PAYMENT_VOUCHER"
        ),
      }));
      data.itemsToFilter = response.data.data.data;
      data.response = {
        from,
        to,
        total,
        current_page,
        per_page,
        last_page,
      };
    });
  };

  const getData = (params: PaymentVoucher) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const resetData = () => {
    if (data.voucherType == VOUCHER_TYPE.NORMAL) {
      data.payables = [];
      getSupplierData(data.voucherType);
    }

    if (data.voucherType == VOUCHER_TYPE.MMAMA) {
      data.payables = [];
      getSupplierData(data.voucherType);
    } else if (data.voucherType == VOUCHER_TYPE.DEPOSIT) {
      getSupplierData(data.voucherType);
      data.payables = [{ id: null, amount: 0.0 }];
    }
  };

  const openConfirmDialog = (deleteId: string) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const approvePVFacility = (model: any) => {
    data.formData = model;
    data.modalTitle = "Accept to Approve this Payment Voucher";
    data.genericDialogAction = approvePVFacilityComplete;
    data.genericConfirmModel = true;
  };

  const approvePVFacilityComplete = () => {
    if (
      typeof data.formData.approves == "undefined" ||
      data.formData.approves.length === 0
    ) {
      return false;
    }
    let currentFlowable = null;
    const approves = data.formData.approves;

    approves.forEach(function (flowable) {
      if (flowable.facility_appoved == null) {
        currentFlowable = flowable;
      }
    });
    if (currentFlowable == null) {
      return false;
    }
    const approveData = {
      approval: currentFlowable,
    };

    approvePVFacilityService(approveData).then(() => {
      data.genericConfirmModel = false;
      getTableData();
    });
  };

  const cancelGenericConfirmDialog = () => {
    data.genericConfirmModel = false;
  };

  const cancelDialog = () => {
    data.formData = {} as PaymentVoucher;
    data.fundingSources = [];
    data.activities = [];
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as PaymentVoucher;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      data.deletemodal = false;
      getTableData();
    });
  };

  const save = () => {
    const payableData = [];
    const payableItems = data.payables;
    for (let i = 0; i < payableItems.length; i++) {
      const element = {
        gl_account_id: payableItems[i].id,
        amount: stringToCurrency(payableItems[i].amount),
      };
      payableData.push(element);
    }
    data.formData.payables = payableData;
    if (data.voucherType == 4) {
      data.formData.is_mmama = true;
    }
    createVoucher(data.formData);
  };

  const openDialog = () => {
    data.formData = {} as PaymentVoucher;
    data.modalTitle = "Create";
    data.searchTerm = "";
    getSupplierData(1);
    getFundingSources();
    loadDepositAccounts();
    data.payables = [];
    data.accounts = [];
    data.fundingSources = [];
    data.gfsCodes = [];
    data.modal = !data.modal;
  };
  const loadDepositAccounts = async () => {
    const params = {
      gl_account_type: "DEPOSIT",
    };

    getGlAccounts({ search: { ...params } }).then((response: AxiosResponse) => {
      data.depositAccounts = response.data.data.data;
      if (response.data.data.data.length > 0) {
        /*   data.depositAccounts = response.data.data.data.map((account) => ({
             ...account,
             displayName: account.code,
           }));*/
      }
    });
  };

  const createVoucher = (data: PaymentVoucher) => {
    create(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const getSupplierData = (voucher: any) => {
    console.log("voucherType", voucher);
    if (voucher == 4) {
      data.suppliers = [];

      getSupplier({ per_page: 10 }).then((response: AxiosResponse) => {
        const allSuppliers = response.data.data.data;
        for (let i = 0; i < allSuppliers.length; i++) {
          const element = allSuppliers[i];
          if (element.ismmama === true) {
            data.suppliers.push(element);
          }
        }
      });
    } else {
      data.suppliers = [];
      getSupplier({ per_page: 10 }).then((response: AxiosResponse) => {
        const allSuppliers = response.data.data.data;
        for (let i = 0; i < allSuppliers.length; i++) {
          const element = allSuppliers[i];
          if (element.active === true && !element.ismmama === true) {
            data.suppliers.push(element);
          }
        }
      });
    }
  };

  const searchSuppliers = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getSupplier({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        const allSuppliers = response.data.data.data;
        for (let i = 0; i < allSuppliers.length; i++) {
          const element = allSuppliers[i];
          if (element.active === true) {
            data.suppliers.push(element);
          }
        }
      }
    );
  };

  const getActivityData = () => {
    getActivity({ per_page: 10 }).then((response: AxiosResponse) => {
      data.activities = response.data.data.data;
    });
  };

  const getFundingSources = async () => {
    const response = await getFundSources({ per_page: 500 });
    data.fundingSources = response.data.data.data;
  };

  const filterActivities = (activity) => {
    data.activities = data.activities.filter(
      (entry) => entry.code === activity
    );
  };

  const searchActivities = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getActivity({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        data.activities = response.data.data.data;
      }
    );
  };

  const searchFundSource = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getFundSources({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        data.fundingSources = response.data.data.data;
      }
    );
  };

  const getActivities = async (fundingSource: any) => {
    data.fundSourceItem = fundingSource;
    const response = await activitiesByFundSource(fundingSource.id);
    const res = response.data.data;
    const key = "code";
    const uniqueEntries = [
      ...new Map(res.map((item) => [item[key], item])).values(),
    ];
    data.activities = uniqueEntries;
  };

  const loadBudget = (item: Activity) => {
    data.activityItem = item;
    getBudget({ activity_code: item.code }).then((response: AxiosResponse) => {
      data.accounts = response.data.data;
    });
  };

  const searchGfsCodes = (activity: any) => {
    fundByActivityFundSource(activity.id, data.fundSourceItem.id).then(
      (response: AxiosResponse) => {
        data.gfsCodes = response.data.data;
      }
    );
    getBudget({
      activity_code: activity.code,
      fund_code: data.fundSourceItem.code,
    }).then((response: AxiosResponse) => {
      data.accounts = response.data.data;
    });
  };

  const filterGfsCodes = (item: string) => {
    getBudget({
      activity_code: data.selectedActivity.code,
      fund_code: data.fundSourceItem.code,
      gfs_code: item,
    }).then((response: AxiosResponse) => {
      data.accounts = response.data.data;
    });
  };

  const maxRules = (propertyType: number) => {
    return (v: number) =>
      (v && v <= propertyType && propertyType >= 0) ||
      `Amount must be less or equal to ${propertyType}`;
  };

  const addPayable = (account: Account) => {
    account.balance = account.allocation - account.totalExpenditure;
    if (!data.payables.includes(account)) {
      data.payables.push(account);
    }
  };

  const removePayable = (index: number) => {
    data.payables.splice(index, 1);
  };

  const payableHeader = [
    {
      text: "Item",
      align: "start",
      sortable: false,
      value: "invoice_number",
      width: "70%",
    },

    {
      text: "Amount",
      align: "start",
      sortable: false,
      value: "amount",
      width: "",
    },
    {
      text: "",
      align: "center",
      sortable: false,
      value: "",
      width: "",
    },
  ];

  const payablePrintHeader = [
    {
      text: "Account code",
      align: "start",
      sortable: false,
      width: "60%",
    },
    {
      text: "Fund source",
      align: "start",
      sortable: false,
      width: "",
    },
    {
      text: "Account description",
      align: "start",
      sortable: false,
      width: "",
    },
    {
      text: "Amount",
      align: "end",
      sortable: false,
      value: "",
      width: "",
    },
  ];
  const previewPaymentVoucher = (id: number) => {
    find(id).then((response: AxiosResponse) => {
      data.pvDetails = response.data.data;
      data.pvDetails.printDate = moment(new Date()).format(
        "DD/MM/YYYY H:mm:ss"
      );
      data.paymentVoucherModal = !data.paymentVoucherModal;
    });
  };

  const cancelPreviewDialog = () => {
    data.paymentVoucherModal = !data.paymentVoucherModal;
  };

  const printPaymentVoucher = (id: number) => {
    printPdf(id);
  };

  const fullPaid = (item) => {
    const bal = Number(item.amount) - Number(item.amount_paid);
    if (bal === 0) {
      return true;
    } else {
      return false;
    }
  };

  const activities = computed(() => {
    return data.activities;
  });

  const isNormal = computed(() => {
    return data.voucherType == VOUCHER_TYPE.NORMAL;
  });

  const isMmama = computed(() => {
    return data.voucherType == VOUCHER_TYPE.MMAMA;
  });

  const isDeposit = computed(() => {
    return data.voucherType == VOUCHER_TYPE.DEPOSIT;
  });

  const normalType = VOUCHER_TYPE.NORMAL;
  const mmamaType = VOUCHER_TYPE.MMAMA;
  const depositType = RECEIPT_TYPE.DEPOSIT;

  return {
    data,
    openDialog,
    cancelDialog,
    openConfirmDialog,
    save,
    remove,
    cancelConfirmDialog,
    getData,
    searchSuppliers,
    addPayable,
    removePayable,
    searchActivities,
    searchGfsCodes,
    loadBudget,
    filterGfsCodes,
    maxRules,
    payableHeader,
    payablePrintHeader,
    cancelPreviewDialog,
    previewPaymentVoucher,
    printPaymentVoucher,
    fullPaid,
    filterVoucher,
    resetSearchText,
    getActivities,
    filterActivities,
    activities,
    searchFundSource,
    isNormal,
    isMmama,
    isDeposit,
    depositType,
    normalType,
    mmamaType,
    resetData,
    cancelGenericConfirmDialog,
    approvePVFacility,
    approvePVFacilityComplete,
  };
};
