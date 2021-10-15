import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  get,
  create,
  destroy,
} from "../services/payment.service";
import { Payment } from "../types/Payment";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/back-accounts.service";
import { get as getPaymentVouchers } from "@/components/payable/payment-voucher/services/payment-voucher.service";
import { FundSources } from "@/components/coa/funding-source/types/index";

export const usePayment = (): any => {
  const dataItems: Array<Payment> = [];
  const paymentData = {} as Payment;
  const fundSourceItem = {} as FundSources;

  const data = reactive({
    title: "Payments",
    valid: false,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "payment_date",
      },
      {
        text: "PV",
        align: "start",
        sortable: false,
        value: "voucher",
      },
      {
        text: "Cheque Type",
        align: "start",
        sortable: false,
        value: "cheque_type",
      },
      {
        text: "Cheque",
        align: "start",
        sortable: false,
        value: "cheque",
      },
      {
        text: "Bank Account",
        align: "start",
        sortable: false,
        value: "bank_account",
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
    formData: paymentData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    searchTerm: "",
    fundSourceItem: fundSourceItem,
    chequeTypes: ["Open","Closed"],
    bankAccounts: [],
    paymentVouchers: [],
    fundingSources: [],
    accounts: [],
    payables: [],
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

  const getData = (params: Payment) => {
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
    data.formData = {} as Payment;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as Payment;
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
    data.formData = {} as Payment;
    data.modalTitle = "Create";
    data.searchTerm = "";
    getBankAccountData();
    getPaymentVoucherData();
    data.modal = !data.modal;
  };

  const createActivity = (data: Payment) => {
    create(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const getBankAccountData = () => {
    getBankAccounts({ per_page: 10 }).then((response: AxiosResponse) => {
      data.bankAccounts = response.data.data.data;
    });
  };
  
  const getPaymentVoucherData = () => {
    getPaymentVouchers({ per_page: 10 }).then((response: AxiosResponse) => {
      data.paymentVouchers = response.data.data.data;
    });
  };

  const maxRules = (propertyType: number) => {
    return (v: number) =>
      (v && v <= propertyType) ||
      `Amount must be less or equal to ${propertyType}`;
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
    maxRules,
  };
};
