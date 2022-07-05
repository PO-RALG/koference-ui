import { AxiosResponse } from "axios";
import { Receipt } from "../types";
import { reactive, onMounted, computed } from "@vue/composition-api";
import stringToCurrency from "@/filters/money-to-number";

import {
  get,
  create,
  regSearch as receiptSearch,
  destroy,
  search,
  printReceipt,
  getFundingSourceList,
} from "../services/receipt-service";
import { get as getCustomers } from "@/components/receivables/customer/services/customer.service";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import {
  fundingSource,
  glAccount,
} from "@/components/receivables/invoice-item-definition/services/invoice-item-definition";
import { getGlAccounts } from "@/components/receivables/receipt/services/receipt-service";
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
      width: "65%",
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
      width: "35%",
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
        text: "Print",
        align: "center",
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
    searchTerm: "",
    receipt_items: [
      {
        gl_account_id: "",
        amount: "",
      },
    ],
    loading: false,
    coat: "/coat_of_arms.svg.png",
    toSave: {},
    search: "",
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
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.loading = false;
    });

    getCustomers({ per_page: 2000, active: true }).then(
      (response: AxiosResponse) => {
        data.customers = response.data.data.data;
      }
    );
  };

  const searchCategory = (categoryName: any) => {
    if (categoryName != null) {
      search({ receipt_number: categoryName.receipt_number }).then(
        (response: AxiosResponse) => {
          data.items = response.data.data.data;
        }
      );
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.receipt.customer_id = "";
    data.receipt.date = "";
    data.receipt.bank_account_id = "";
    data.receipt.bank_reference_number = "";
    data.receipt.description = "";
    data.receipt = receipt;
    data.gl_accounts = [];
    (data.receipt_items = [
      {
        gl_account_id: "",
        amount: "",
      },
    ]),
      (data.modal = !data.modal);
  };

  const mapInvoices = (invoices) => {
    return invoices.filter(
      (invoice) =>
        parseFloat(invoice.received_amount) < parseFloat(invoice.amount)
    );
  };

  const accounts = computed(() => {
    return data.bankaccounts.map((account: any) => {
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
    const ac = data.glAccounts.find(
      (glAccount: any) => glAccount.code === account
    );
    return ac.id;
  };

  const getFundingSource = (id: number): number => {
    const fs = data.fundingSources.find((fs: any) => fs.id === id);
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
        items: data.selectedInvoice.invoice_items
          .map((item: any) => ({
            invoice_item_id: item.id,
            amount: stringToCurrency(item.pay_amount),
            gl_account_id: geGlAccountId(item.gl_account),
            funding_source_code: getFundingSource(
              item.definition.funding_source_id
            ),
          }))
          .filter((item: any) => item.amount > 0),
      };
    } else {
      if (data.receipt.invoice_id) {
        delete data.receipt.invoice_id;
      }

      payload = {
        customer_id: data.receipt.customer_id,
        date: data.receipt.date,
        bank_account_id: data.receipt.bank_account_id,
        bank_reference_number: data.receipt.bank_reference_number,
        description: data.receipt.description,
        items: data.receipt.items
          .map((entry) => ({
            ...entry,
            amount: stringToCurrency(entry.amount),
          }))
          .filter((item: any) => item.amount > 0),
      };
      // payload = data.receipt;
    }
    console.log(payload);
    create(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        init();
        data.modal = false;
      }
    });
  };

  const openDialog = (formData?: any) => {
    data.modalTitle = "Create";
    data.modal = !data.modal;

    getBankAccounts({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });

    fundingSource({ per_page: 2000 }).then((response: AxiosResponse) => {
      const fundingSources = response.data.data.data;
      data.fundingSources = fundingSources.map(function (element) {
        return {
          ...element,
          description: element.description + "( " + element.code + ")",
        };
      });
    });

    glAccount({ per_page: 2000, gl_account_type: "REVENUE" }).then(
      (response: AxiosResponse) => {
        data.glAccounts = response.data.data.data;
      }
    );
  };


  const setDisplayName = (account: Record<any, any>) => {
    const result = account.code.split("-");
    const length = result.length;
    const fund = result[length - 2];
    const activity = result[length - 1];
    return `${fund}-${activity}`;
  };

  const loadGLAccounts = async (fundSourceCode, index) => {
    const params = {
      gl_account_type: "REVENUE",
      fund_code: fundSourceCode,
    };

    getGlAccounts({ search: { ...params } }).then((response: AxiosResponse) => {
      const accounts = response.data.data.data;
      if (response.data.data.data.length > 0) {
        data.gl_accounts = [accounts.map((account) => ({
            ...account,
            displayName: setDisplayName(account),
          })),
        ];
      }
    });
  };

  const newreceiptItem: any = computed(() => {
    return data.items
      ? data.items.map((data, index) => ({
          ...data,
          index: ++index,
          newData: data,
          bankAccount:
            data.bank_account.bank +
            data.bank_account.name +
            " (" +
            data.bank_account.number +
            ")",
        }))
      : [];
  });

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
    data.receipt.customer_id = "";
    data.receipt.date = "";
    data.receipt.bank_account_id = "";
    data.receipt.bank_reference_number = "";
    data.receipt.description = "";
    data.receipt.items = [
      {
        funding_source_code: null,
        gl_account_id: null,
        amount: null,
      },
    ];
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
      data.receipt.customer_id = "";
      data.receipt.date = "";
      data.receipt.bank_account_id = "";
      data.receipt.bank_reference_number = "";
      data.receipt.description = "";
      data.receipt.items = [
        {
          funding_source_code: null,
          gl_account_id: null,
          amount: null,
        },
      ];
      (data.receipt.invoice_id = null), (data.selectedInvoice = null);
      data.minDate = null;
      data.maxDate = moment(new Date()).format("YYYY-MM-DD");
    } else {
      data.minDate = data.selectedInvoice
        ? moment(data.selectedInvoice.date).format("YYYY-MM-DD")
        : moment(new Date()).format("YYYY-MM-DD");
    }
  };

  const filterReceipt = () => {
    if (data.searchTerm.length >= 3) {
      get({ regSearch: data.searchTerm }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    }
    if (data.searchTerm.length === 0) {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
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
  const reanderSearched = (categoryName: any) => {
    // console.log("categoryname", categoryName.invoice_number);
    if (categoryName != null && categoryName.length >= 2) {
      receiptSearch({ regSearch: categoryName }).then(
        (response: AxiosResponse) => {
          data.itemsToFilter = response.data.data.data;
        }
      );
    } else if (categoryName ? categoryName.length == 0 : "") {
      reloadData();
      data.search = "";
    } else {
      reloadData();
    }
  };

  const reverseReceipt = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemTodelete = deleteId;
    data.invoicedetails = false;
  };

  return {
    data,
    reverseReceipt,
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
    reanderSearched,
    mapInvoices,
    filterReceipt,
    resetSearchText,
  };
};
