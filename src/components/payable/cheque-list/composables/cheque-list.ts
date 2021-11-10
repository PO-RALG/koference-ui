import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import {
  get,
  getPayments,
  create,
  destroy,
  printPdf,
} from "../services/cheque-list.services";
import { ChequeList } from "../types/ChequeList";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/back-accounts.service";

export const useChequeList = (): any => {
  const dataItems: Array<ChequeList> = [];
  const chequeListData = {} as ChequeList;

  const data = reactive({
    title: "Chequelists",
    valid: false,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    modal: false,
    deletemodal: false,
    itemtodelete: "",
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "date",
      },
      {
        text: "Bank Account",
        align: "start",
        sortable: false,
        value: "bank_account",
      },
      {
        text: "Amount",
        align: "start",
        sortable: false,
        value: "amount",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    paymentHeaders: [
      {
        text: "Payment #",
        align: "start",
        sortable: false,
        value: "reference_no",
      },
      {
        text: "Payment Date",
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
    payments: [],
    bankAccounts: [],
    selected: [],
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

  const openDialog = () => {
    data.formData = {} as ChequeList;
    data.modalTitle = "Create";
    data.searchTerm = "";
    data.modal = !data.modal;
    getBankAccountData();
  };

  const cancelDialog = () => {
    data.formData = {} as ChequeList;
    data.payments = [];
    data.modal = !data.modal;
  };

  const save = () => {
    const paymentData = data.payments;
    const chequeListItemsData = [];
    for (let j = 0; j < paymentData.length; j++) {
      const element = paymentData[j];
      chequeListItemsData.push({ payment_id: element.id });
    }

    const chequeListData = {
      date: data.formData.date,
      bank_account_id: data.formData.bank_account_id,
      chequeListItems: chequeListItemsData,
    };
    
    if (data.selected.length > 0) {
      createChequeList(chequeListData);
    }
  };

  const createChequeList = (data: ChequeList) => {
    create(data).then(() => {
      cancelDialog();
      getTableData();
    });
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

  const openConfirmDialog = (deleteId: string) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as ChequeList;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      data.deletemodal = false;
      getTableData();
    });
  };

  const printChequelist = (id: number) => {
    printPdf(id);
  };

  return {
    data,
    getData,
    openDialog,
    cancelDialog,
    save,
    searchPaymentByDate,
    openConfirmDialog,
    cancelConfirmDialog,
    remove,
    printChequelist,
  };
};
