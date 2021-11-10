import { AxiosResponse } from "axios";
import { Invoice } from "../types";
import { reactive, onMounted, computed } from "@vue/composition-api";
import {
  get,
  create,
  update,
  destroy,
  search,
  viewinvoice,
  printReceipt,
} from "../services/invoice";
import { customers } from "@/components/setup/customer/services/customer.service";
import { bankaccounts } from "@/components/setup/bank-account/services/back-accounts.service";
import { glAccounts } from "@/components/setup/invoice-item-definition/services/invoice-item-definition";

export const useReceipt = (): any => {
  const dataItems: Array<Invoice> = [];
  let invoiceData: Invoice;

  const data = reactive({
    invoicereceip: {
      invoice_id: "",
      date: "",
      description: "",
      customer_id: "",
      bank_account_id: "",
      bank_reference_number: "",
      invoice_number: "",
      items: [],
    },

    title: "Manage Receipts",
    modalTitle: "",
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
    formData: invoiceData,
    rows: ["10", "20", "50", "100"],
    itemTodelete: "",
    response: {},
    bankName: [],
    customers: [],
    glAccounts: [],
    invoicedata: invoiceData,
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
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.loading = false;
    });

    customers({ per_page: 2000, active: true }).then(
      (response: AxiosResponse) => {
        data.customers = response.data.data.data;
      }
    );
  });

  const searchCategory = (categoryName) => {
    console.log("receipt_number", categoryName);
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

  const deleteInvoiceItemdefinition = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemTodelete = deleteId;
    data.invoicedetails = false;
  };

  const getInvoiceItemdefinition = () => {
    get(data);
  };

  const cancelDialog = () => {
    data.formData = {} as Invoice;
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
  };

  const cancelInvoiceReceipt = () => {
    data.invoicedetails = true;
    data.invoicereceip.items = [];
  };

  const bankName = computed(() => {
    return data.bankaccounts.map((account) => {
      account.fullName = `Account Number -${account.number}  ${account.bank} - ${account.branch}`;
      return account;
    });
  });

  const cancelConfirmDialog = () => {
    data.formData = {} as Invoice;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemTodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    data.formData.items = data.receipt_items;
    if (data.formData.id) {
      updateInvoiceItemDefinition(data.formData);
    } else {
      createInvoice(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as Invoice;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;

    bankaccounts({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });

    glAccounts({ per_page: 2000, gl_account_type: "REVENUE" }).then(
      (response: AxiosResponse) => {
        data.glAccounts = response.data.data.data;
      }
    );
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
    data.receipt_items.push({
      gl_account_id: "",
      amount: "",
    });
  };

  const checkDublicate = (value, index) => {
    const obj = data.receipt_items.filter((o) => o.gl_account_id === value);
    if (obj.length < 2) {
      // addRow();
    } else {
      data.receipt_items.splice(index, 10000);
    }
  };

  const removeRow = (index: number) => {
    data.receipt_items.splice(index, 1);
  };

  const print = (id: number) => {
    printReceipt(id);
  };

  const previewInvoice = (item: any) => {
    viewinvoice(item).then((response: AxiosResponse) => {
      data.invoicedata = response.data.data;
      data.invoicedetails = true;
    });
  };

  const newInvoiceItems = computed(() => {
    if (data.invoicereceip) {
      return data.invoicereceip.items.map((item) => {
        item.cleared = item.invoicedAmount == item.received ? true : false;
        return item;
      });
    }
  });

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
    previewInvoice,
    cancelInvoiceDialog,
    cancelInvoiceReceipt,
    bankName,
    newInvoiceItems,
    checkDublicate,
    newreceiptItem,
    print,
  };
};
