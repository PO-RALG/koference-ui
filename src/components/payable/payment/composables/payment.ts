import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import moment from "moment";

import {
  get,
  create,
  destroy,
  find,
  printPdf,
} from "../services/payment.services";
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
    showDate: false,
    node: null,
    maxDate: moment(new Date()).format("YYYY-MM-DD"),
    minDate: null,
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
        text: "Payment #",
        align: "start",
        sortable: false,
        value: "reference_no",
      },
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "payment_date",
      },
      {
        text: "Payee",
        align: "start",
        sortable: false,
        value: "voucher.supplier.name",
      },
      {
        text: "Cheque #",
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
        text: "Amount",
        align: "end",
        sortable: false,
        value: "amount",
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
    reverseForm: {
      id: "",
    },
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
    itemTodelete: "",
  });

  onMounted(() => {
    getTableData();
  });

  const filterPayment = () => {
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

  const openRequestReversalDialog = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.reverseForm.id = deleteId;
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
    destroy(data.reverseForm).then(() => {
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
    const dataToSave = {
      ...data.formData,
      voucher_id: data.formData.voucher_id.id,
      payable_id: data.formData.voucher_id.payables[0].id,
    };

    createPayment(dataToSave);
  };

  const openDialog = () => {
    data.formData = {} as Payment;
    data.modalTitle = "Create";
    data.searchTerm = "";
    getBankAccountData();
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
      const vouchers = response.data.data.data;
      for (let i = 0; i < vouchers.length; i++) {
        const element = vouchers[i];
        if (element.amount_paid != element.amount) {
          data.paymentVouchers.push(element);
        }
      }
    });
  };

  const maxRules = (propertyType: number) => {
    return (v: number) =>
      (v && v <= propertyType) ||
      `Amount must be less or equal to ${propertyType}`;
  };

  const setPayableItems = (voucher: Record<any, any>) => {
    data.showDate = true;
    data.minDate = moment(voucher.date).format("YYYY-MM-DD");
    findPaymentVoucher(voucher.id).then((response: AxiosResponse) => {
      // console.log("xxxxxxx", response.data.data.payables);
      const pvData = response.data.data.payables;
      data.payableItems = [
        ...pvData.map((pv: Record<any, any>) => ({
          payment: Number(pv.amount),
          id: Number(pv.id),
          required_amount: Number(pv.amount),
          paid_amount: Number(pv.paid_amount),
          balance: Number(pv.amount) - Number(pv.paid_amount),
          description: pv.description,
          funding_source: pv.funding_source,
        })),
      ];
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
      data.pvDetails.printDate = moment(new Date()).format(
        "DD/MM/YYYY H:mm:ss"
      );
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

  const mappedVouchers = (vouchers: any) => {
    return vouchers.filter(
      (voucher) => parseFloat(voucher.amount) > parseFloat(voucher.amount_paid)
    );
  };

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
    filterPayment,
    resetSearchText,
    mappedVouchers,
  };
};
