import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  get,
  find,
  create,
  destroy,
  printPdf,
  fundByActivity,
  fundByActivityFundSource,
} from "../services/payment-voucher.service";
import { PaymentVoucher, Account } from "../types/PaymentVoucher";
import { get as getSupplier } from "@/components/payable/supplier/services/supplier.service";
import { get as getActivity } from "@/components/planning/activity/services/activity.service";
import { getBudget } from "@/components/payable/fund-allocation/services/fund-allocation.service";
import { Activity } from "@/components/planning/activity/types/Activity";
import { FundSources } from "@/components/coa/funding-source/types/index";

export const usePaymentVoucher = (): any => {
  const dataItems: Array<PaymentVoucher> = [];
  const paymentVoucherData = {} as PaymentVoucher;
  const activityItem = {} as Activity;
  const fundSourceItem = {} as FundSources;

  const data = reactive({
    title: "Payment Vouchers",
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
        text: "Full Paid",
        align: "start",
        sortable: false,
        value: "full_paid",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: paymentVoucherData,
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
    payables: [],
    coat: "/coat_of_arms.svg.png",
    pvDetails: { printDate: "" },
    paymentVoucherModal: false,
  });

  onMounted(() => {
    getTableData();
  });

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const getData = (params: PaymentVoucher) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openConfirmDialog = (deleteId: string) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const cancelDialog = () => {
    data.formData = {} as PaymentVoucher;
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
        amount: payableItems[i].amount,
      };
      payableData.push(element);
    }
    data.formData.payables = payableData;

    createActivity(data.formData);
  };

  const openDialog = () => {
    data.formData = {} as PaymentVoucher;
    data.modalTitle = "Create";
    data.searchTerm = "";
    getSupplierData();
    getActivityData();
    data.payables = [];
    data.accounts = [];
    data.fundingSources = [];
    data.gfsCodes = [];
    data.modal = !data.modal;
  };

  const createActivity = (data: PaymentVoucher) => {
    create(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const getSupplierData = () => {
    getSupplier({ per_page: 10 }).then((response: AxiosResponse) => {
      data.suppliers = response.data.data.data;
    });
  };

  const searchSuppliers = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getSupplier({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        data.suppliers = response.data.data.data;
      }
    );
  };

  const getActivityData = () => {
    getActivity({ per_page: 10 }).then((response: AxiosResponse) => {
      data.activities = response.data.data.data;
    });
  };

  const searchActivities = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getActivity({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        data.activities = response.data.data.data;
      }
    );
  };

  const searchFundingSource = (item: Activity) => {
    data.activityItem = item;
    fundByActivity(item.id).then((response: AxiosResponse) => {
      data.fundingSources = response.data.data;
    });

    getBudget({ activity_code: item.code }).then((response: AxiosResponse) => {
      data.accounts = response.data.data;
    });
  };

  const searchGfsCodes = (fund: FundSources) => {
    data.fundSourceItem = fund;
    fundByActivityFundSource(data.activityItem.id, data.fundSourceItem.id).then(
      (response: AxiosResponse) => {
        data.gfsCodes = response.data.data;
      }
    );
    getBudget({
      activity_code: data.activityItem.code,
      fund_code: data.fundSourceItem.code,
    }).then((response: AxiosResponse) => {
      data.accounts = response.data.data;
    });
  };

  const filterGfsCodes = (item: string) => {
    getBudget({
      activity_code: data.activityItem.code,
      fund_code: data.fundSourceItem.code,
      gfs_code: item,
    }).then((response: AxiosResponse) => {
      data.accounts = response.data.data;
    });
  };

  const maxRules = (propertyType: number) => {
    return (v: number) =>
      (v && v <= propertyType) ||
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
      data.pvDetails.printDate = Date();
      data.paymentVoucherModal = !data.paymentVoucherModal;
    });
  };

  const cancelPreviewDialog = () => {
    data.paymentVoucherModal = !data.paymentVoucherModal;
  };

  const printPaymentVoucher = (id: number) => {
    printPdf(id);
  };

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
    searchFundingSource,
    filterGfsCodes,
    maxRules,
    payableHeader,
    payablePrintHeader,
    cancelPreviewDialog,
    previewPaymentVoucher,
    printPaymentVoucher,
  };
};
