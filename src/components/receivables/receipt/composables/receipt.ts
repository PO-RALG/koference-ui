import { AxiosResponse } from "axios";
import { Receipt } from "../types";
import { reactive, onMounted, computed } from "@vue/composition-api";
import { get, create, update, destroy, search, printReceipt } from "../services/invoice";
import { get as getCustomers } from "@/components/receivables/customer/services/customer.service";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import {
  fundingSource,
  glAccount,
} from "@/components/receivables/invoice-item-definition/services/invoice-item-definition";
import moment from "moment";

export const useReceipt = (): any => {
  const receipt = reactive({
    id: null,
    customer_id: null,
    date: null,
    bank_reference_number: null,
    description: null,
    bank_account_id: null,
    lines: [
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
    modalTitle: "",
    maxDate: moment(new Date()).format("YYYY-MM-DD"),
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
        value: "amount",
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
      date: null,
      bank_reference_number: null,
      description: null,
      bank_account_id: null,
      lines: [
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
    bankName: [],
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
  });

  const searchCategory = (categoryName) => {
    console.log("receipt_number", categoryName);
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

  const deleteInvoiceItemdefinition = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemTodelete = deleteId;
    data.invoicedetails = false;
  };

  const getInvoiceItemdefinition = () => {
    get(data);
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

  const cancelInvoiceDialog = () => {
    data.invoicedetails = false;
    data.receipt = receipt;
  };

  const cancelInvoiceReceipt = () => {
    data.invoicedetails = true;
    data.receipt = receipt;
  };

  const bankName = computed(() => {
    return data.bankaccounts.map((account) => {
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

  const save = () => {
    if (data.receipt.id) {
      updateInvoiceItemDefinition(data.receipt);
    } else {
      createInvoice(data.receipt);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.receipt = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
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

  const fundingSourceName = computed(() => {
    return data.fundingSources.map((fundsource) => {
      fundsource.fullName = `${fundsource.code}  ${fundsource.description}`;
      fundsource.filteredGL = data.glAccounts.find((o) => o.fund_code === "10C");

      return fundsource;
    });
  });

  const newreceiptItem: any = computed(() => {
    return data.items
      ? data.items.map((data, index) => ({
          ...data,
          index: ++index,
          newData: data,
          bankAccount: data.bank_account.bank + data.bank_account.name + " (" + data.bank_account.number + ")",
        }))
      : [];
  });

  const updateInvoiceItemDefinition = (data: any) => {
    update(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const createInvoice = (data: any) => {
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
    data.receipt.lines.push({
      funding_source_code: null,
      gl_account_id: null,
      amount: null,
    });
  };

  const removeRow = (index: number) => {
    data.receipt.lines.splice(index, 1);
  };

  const print = (id: number) => {
    printReceipt(id);
  };

  return {
    data,
    getData,
    addRow,
    removeRow,
    openDialog,
    cancelDialog,
    deleteInvoiceItemdefinition,
    getInvoiceItemdefinition,
    updateInvoiceItemDefinition,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    cancelInvoiceDialog,
    cancelInvoiceReceipt,
    bankName,
    newreceiptItem,
    print,
    fundingSourceName,
    HEADERS,
    loadGLAccounts,
  };
};
