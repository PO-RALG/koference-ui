import { AxiosResponse } from "axios";
import { Receipt } from "../types";
import { reactive, onMounted, computed } from "@vue/composition-api";
import { get, create, update, destroy, search, printReceipt } from "../services/receipt-service";
import { get as getCustomers } from "@/components/receivables/customer/services/customer.service";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import {
  fundingSource,
  glAccount,
} from "@/components/receivables/invoice-item-definition/services/invoice-item-definition";
import moment from "moment";

export const useReceipt = (): any => {
  const INVOICE_ITEM_HEADERS = [
    {
      text: "Item",
      align: "start",
      sortable: false,
      value: "invoice_number",
      width: "30%",
    },

    {
      text: "Amount",
      align: "start",
      sortable: false,
      value: "amount",
      width: "20%",
    },
    {
      text: "Amount Received",
      align: "start",
      sortable: false,
      value: "amount",
      width: "20%",
    },
    {
      text: "Add Amount",
      align: "start",
      sortable: false,
      value: "amount",
      width: "20%",
    },
  ];

  const receipt = reactive({
    id: null,
    customer_id: null,
    invoice_id: null,
    date: null,
    bank_reference_number: null,
    description: null,
    bank_account_id: null,
    items: [
      {
        funding_source_code: null,
        gl_account_id: null,
        amount: null,
      },
    ],
  });

  const dataItems: Array<Receipt> = [];
  let receiptData: Receipt;
  const HEADERS = [
    {
      text: "Fund Source",
      align: "start",
      sortable: false,
      value: "invoice_number",
      width: "80%",
    },
    {
      text: "GL Account",
      align: "start",
      sortable: false,
      width: "20%",
    },

    {
      text: "Amount",
      align: "start",
      sortable: false,
      value: "amount",
      width: "20%",
    },
  ];

  const data = reactive({
    title: "Manage Receipts",
    isInvoice: "NO",
    selectedUser: null,
    selectedInvoice: null,
    modalTitle: "",
    maxDate: moment(new Date()).format("YYYY-MM-DD"),
    minDate: null,
    headers: [
      {
        text: "Receipt Number",
        align: "start",
        sortable: false,
        value: "receipt_number",
      },
      { text: "Date", value: "date", sortable: true },

      {
        text: "Amount",
        align: "start",
        sortable: false,
        value: "totalAmt",
      },
      {
        text: "From",
        align: "start",
        sortable: false,
        value: "customer.name",
      },

      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: "Bank Account",
        align: "start",
        sortable: false,
        value: "bank_account",
      },
      {
        text: "Action",
        align: "start",
        sortable: false,
        value: "actions",
      },
    ],
    modal: false,
    deletemodal: false,
    invoicedetails: false,

    items: dataItems,
    itemsToFilter: [],
    gl_accounts: [],
    receipt: {
      id: null,
      customer_id: null,
      invoice_id: null,
      date: null,
      bank_reference_number: null,
      description: null,
      bank_account_id: null,
      items: [
        {
          funding_source_code: null,
          gl_account_id: null,
          amount: null,
        },
      ],
    },

    rows: ["10", "20", "50", "100"],
    itemTodelete: "",
    response: {},
    accounts: [],
    customers: [],
    fundingSources: [],
    glAccounts: [],
    receiptdata: receiptData,
    bankaccounts: [],
    customer: [],
    receipt_items: [
      {
        gl_account_id: "",
        amount: "",
      },
    ],
    loading: false,
    coat: "/coat_of_arms.svg.png",
    toSave: {},
  });

  onMounted(() => {
    init();
  });

  const init = () => {
    data.receipt = {
      id: null,
      customer_id: null,
      invoice_id: null,
      date: null,
      bank_reference_number: null,
      description: null,
      bank_account_id: null,
      items: [
        {
          funding_source_code: null,
          gl_account_id: null,
          amount: null,
        },
      ],
    };
    data.loading = true;
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.loading = false;
    });

    getCustomers({ per_page: 2000, active: true }).then((response: AxiosResponse) => {
      data.customers = response.data.data.data;
    });
  };

  const searchCategory = (categoryName: Object) => {
    if (categoryName != null) {
      search({ receipt_number: categoryName.receipt_number }).then((response: AxiosResponse) => {
        data.items = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.receipt = receipt;
    (data.receipt_items = [
      {
        gl_account_id: "",
        amount: "",
      },
    ]),
      (data.modal = !data.modal);
  };

  const accounts = computed(() => {
    return data.bankaccounts.map((account: Object<any>) => {
      account.fullName = `Account Number -${account.number}  ${account.bank} - ${account.branch}`;
      return account;
    });
  });

  const cancelConfirmDialog = () => {
    data.receipt = receipt;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemTodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const geGlAccountId = (account: any): string => {
    const ac = data.glAccounts.find((glAccount: Object<any>) => glAccount.code === account);
    return ac.id;
  };

  const getFundingSource = (id: number): number => {
    const fs = data.fundingSources.find((fs: Object<any>) => fs.id === id);
    return fs.code;
  };

  const save = () => {
    let payload = {};
    if (isInvoice && data.selectedInvoice) {
      payload = {
        customer_id: data.receipt.customer_id,
        invoice_id: data.selectedInvoice.id,
        date: data.receipt.date,
        bank_account_id: data.receipt.bank_account_id,
        bank_reference_number: data.receipt.bank_reference_number,
        description: data.receipt.description,
        items: data.selectedInvoice.invoice_items.map((item: any) => {
          return {
            invoice_item_id: item.id,
            amount: item.pay_amount,
            gl_account_id: geGlAccountId(item.gl_account),
            funding_source_code: getFundingSource(item.definition.funding_source_id),
          };
        }),
      };
    } else {
      if (data.receipt.invoice_id) {
        delete data.receipt.invoice_id;
      }
      payload = data.receipt;
    }
    create(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        init();
        data.modal = false;
      }
    });
  };

  const openDialog = (formData?: Object<any>) => {
    data.modalTitle = "Create";
    data.modal = !data.modal;

    getBankAccounts({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });

    fundingSource({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.fundingSources = response.data.data.data;
    });

    glAccount({ per_page: 2000, gl_account_type: "REVENUE" }).then((response: AxiosResponse) => {
      data.glAccounts = response.data.data.data;
    });
  };

  const loadGLAccounts = async (fundSourceCode, index) => {
    const params = {
      per_page: 10,
      gl_account_type: "REVENUE",
      fund_code: fundSourceCode,
    };

    glAccount(params).then((response: AxiosResponse) => {
      if (response.data.data.data.length > 0) {
        data.gl_accounts.push(response.data.data.data);
      }
    });
  };

  const newreceiptItem: any = computed(() => {
    return data.items
      ? data.items.map((data, index) => ({
        ...data,
        index: ++index,
        newData: data,
        totalAmt: data.invoice_id? data.cash_book.dr_amount : data.amount,
        bankAccount: data.bank_account.bank + data.bank_account.name + " (" + data.bank_account.number + ")",
      }))
      : [];
  });

  const updateReceipt = (data: any) => {
    update(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const createReceipt = (data: any) => {
    create(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const addRow = () => {
    data.receipt.items.push({
      funding_source_code: null,
      gl_account_id: null,
      amount: null,
    });
  };

  const removeRow = (index: number) => {
    data.receipt.items.splice(index, 1);
  };

  const print = (id: number) => {
    printReceipt(id);
  };

  const isInvoice = computed(() => {
    return data.isInvoice === "YES" ? true : false;
  });

  const setCustomer = (invoice) => {
    data.selectedUser = invoice.customer;
    data.selectedInvoice = invoice;
    data.receipt.customer_id = invoice.customer_id;
    data.receipt.invoice_id = invoice.id;
    data.minDate = moment(invoice.date).format("YYYY-MM-DD");
  };

  const resetDate = () => {
    if (data.isInvoice === "NO") {
      data.selectedInvoice = null;
      data.minDate = null;
      data.maxDate = moment(new Date()).format("YYYY-MM-DD");
    } else {
      data.minDate = data.selectedInvoice
        ? moment(data.selectedInvoice.date).format("YYYY-MM-DD")
        : moment(new Date()).format("YYYY-MM-DD");
    }
  };

  return {
    data,
    getData,
    addRow,
    removeRow,
    openDialog,
    cancelDialog,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    accounts,
    newreceiptItem,
    print,
    HEADERS,
    INVOICE_ITEM_HEADERS,
    loadGLAccounts,
    isInvoice,
    setCustomer,
    resetDate,
  };
};
