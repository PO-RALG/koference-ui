import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import moment from "moment";

import { get, create, destroy, find, printPdf } from "../services/payment.services";
import { Payment } from "../types/Payment";
import { find as findPaymentVoucher } from "@/components/payable/voucher/services/payment-voucher.services";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import { get as getPaymentVouchers } from "@/components/payable/voucher/services/payment-voucher.services";
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
    maxDate: moment(new Date()).format("YYYY-MM-DD"),
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "PV #",
        align: "start",
        sortable: false,
        value: "voucher",
      },
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "payment_date",
      },
      {
        text: "Amount",
        align: "start",
        sortable: false,
        value: "amount",
      },
      {
        text: "Payee",
        align: "start",
        sortable: false,
        value: "voucher.supplier.name",
      },
      {
        text: "Bank Account",
        align: "start",
        sortable: false,
        value: "bank_account",
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
    chequeTypes: ["Open", "Closed"],
    bankAccounts: [],
    paymentVouchers: [],
    payableItems: [],
    coat: "/coat_of_arms.svg.png",
    paymentModal: false,
    pvDetails: { printDate: "" },
    supplier: [],
  });

  onMounted(() => {
    getTableData();
  });

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
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

  const openRequestReversalDialog = (deleteId: string) => {
    console.log(deleteId);
  };

  const openHistoryDialog = (deleteId: string) => {
    console.log(deleteId);
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
    const payableItems = data.payableItems;
    for (let i = 0; i < payableItems.length; i++) {
      const element = {
        payable_id: payableItems[i].id,
        amount: payableItems[i].payment,
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
    return (v: number) => (v && v <= propertyType) || `Amount must be less or equal to ${propertyType}`;
  };

  const setPayableItems = (id: number) => {
    const payable = data.paymentVouchers.find((item) => item.id === id);
    data.maxDate = moment(payable.date).format("YYYY-MM-DD");
    findPaymentVoucher(id).then((response: AxiosResponse) => {
      const pvData = response.data.data;
      for (let j = 0; j < pvData.payables.length; j++) {
        const e = pvData.payables[j];
        e.payment = Number(e.amount);
        e.required_amount = Number(e.amount);
        e.paid_amount = Number(e.paid_amount);
        e.balance = Number(e.amount) - Number(e.paid_amount);

        data.payableItems.push(e);
      }
      return data.payableItems;
    });
  };

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
  ];

  const previewPayment = (id: number) => {
    find(id).then((response: AxiosResponse) => {
      data.pvDetails = response.data.data;
      data.pvDetails.printDate = moment(new Date()).format("DD/MM/YYYY H:mm:ss");
      data.supplier = response.data.data.voucher.supplier;
      data.paymentModal = !data.paymentModal;
    });
  };

  const cancelPreviewDialog = () => {
    data.paymentModal = !data.paymentModal;
  };

  const printPayment = (id: number) => {
    printPdf(id);
  };

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

  return {
    data,
    openDialog,
    cancelDialog,
    openRequestReversalDialog,
    save,
    remove,
    cancelConfirmDialog,
    getData,
    maxRules,
    setPayableItems,
    payableHeader,
    openHistoryDialog,
    previewPayment,
    cancelPreviewDialog,
    printPayment,
    payablePrintHeader,
  };
};
