import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import moment from "moment";
import { get, find, getPayments } from "../services/cheque-list.services";
import { ChequeList } from "../types/ChequeList";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/back-accounts.service";

export const useChequeList = (): any => {
  const dataItems: Array<ChequeList> = [];
  const chequeListData = {} as ChequeList;

  const data = reactive({
    title: "Cheque Lists",
    valid: false,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    modal: false,
    headers: [
      {
        text: "Payment #",
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
    paymentHeaders: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "payment_date",
      },
      {
        text: "Payment #",
        align: "start",
        sortable: false,
        value: "reference_no",
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
        text: "Select",
        value: "activations",
        sortable: false,
      },
    ],
    items: dataItems,
    itemsToFilter: [],
    formData: chequeListData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    searchTerm: "",
    coat: "/coat_of_arms.svg.png",
    pvDetails: { printDate: "" },
    CreditorModal: false,
    payments: [],
    bankAccounts: [],
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

  const getData = (params: ChequeList) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
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

  const openDialog = () => {
    data.formData = {} as ChequeList;
    data.modalTitle = "Create";
    data.searchTerm = "";
    data.modal = !data.modal;
    getBankAccountData();
  };

  const cancelDialog = () => {
    data.formData = {} as ChequeList;
    data.modal = !data.modal;
  };

  const save = () => {
    const payableData = [];

    // createPayment(data.formData);
  };
  
  const previewPayment = (id: number) => {
    find(id).then((response: AxiosResponse) => {
      data.pvDetails = response.data.data;
      data.pvDetails.printDate = moment(new Date()).format(
        "DD/MM/YYYY H:mm:ss"
      );
      data.CreditorModal = !data.CreditorModal;
    });
  };

  const cancelPreviewDialog = () => {
    data.CreditorModal = !data.CreditorModal;
  };

  const searchPaymentByDate = () => {
    getPayments(data.formData).then((response: AxiosResponse) => {
      const allPayments = response.data.data;
      for (let i = 0; i < allPayments.length; i++) {
        const element = allPayments[i];
        element.active = false;
        data.payments.push(element);
      }
    });
  };

  const getBankAccountData = () => {
    getBankAccounts({ per_page: 10 }).then((response: AxiosResponse) => {
      data.bankAccounts = response.data.data.data;
    });
  };

  return {
    data,
    getData,
    payablePrintHeader,
    cancelPreviewDialog,
    previewPayment,
    openDialog,
    cancelDialog,
    save,
    searchPaymentByDate,
  };
};
