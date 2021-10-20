import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  get,
  create,
  destroy,
} from "../services/payment.service";
import { Payment, ItemPlayLoad} from "../types/Payment";
import { PaymentVoucher} from "@/components/payable/payment-voucher/types/PaymentVoucher";
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
    payableItems: [],
    payables: [{payable_id: '', required_amount: 0, amount: 0}],
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
        payable_id: payableItems[i].payable_id,
        amount: payableItems[i].amount,
      };
      payableData.push(element);
    }
    data.formData.items = payableData;

    createPayment(data.formData);
  };

  const openDialog = () => {
    data.formData = {} as Payment;
    data.modalTitle = "Create";
    data.searchTerm = "";
    getBankAccountData();
    getPaymentVoucherData();
    data.modal = !data.modal;
  };

  const createPayment = (data: Payment) => {
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

  const addPayable = () => {
    data.payables.push({ payable_id: "", required_amount: 0, amount: 0 });
  };

  const removePayable = (index: number) => {
    data.payables.splice(index, 1);
  };

  const setPayableItems = (id: number) => {
    const pvData = data.paymentVouchers
    for (let i = 0; i < pvData.length; i++) {
      const element = pvData[i];
      if (element.id === id) {
        return data.payableItems = element.payables;
      }
    }
  }

  const setAmount = (id: number, index: number) => {
    const payableData = data.payableItems;
    for (let i = 0; i < payableData.length; i++) {
      const element = payableData[i];
      if (element.id === id) {
        return data.payables[index].required_amount = element.amount *1;
      }
    }
  }

  const payableHeader = [
    {
      text: "Item",
      align: "start",
      sortable: false,
      width: "50%",
    },
    {
      text: "Amount",
      align: "start",
      sortable: false,
      width: "",
    },
    {
      text: "Paid amount",
      align: "start",
      sortable: false,
      width: "",
    },
    {
      text: "Payment",
      align: "start",
      sortable: false,
      value: "",
      width: "",
    },
    {
      text: "",
      align: "start",
      sortable: false,
      value: "",
      width: "",
    },
  ];

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
    addPayable,
    removePayable,
    setPayableItems,
    setAmount,
    payableHeader,
  };
};
