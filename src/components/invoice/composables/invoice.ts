import { AxiosResponse } from "axios";
import { Invoice } from "../types";
import { reactive, onMounted, ref, computed } from "@vue/composition-api";
import {
  get,
  create,
  update,
  destroy,
  search,
  viewinvoice,
  receiptcreate,
} from "../services/invoice";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import { customers } from "@/components/setup/customer/services/customer.service";
import { bankaccounts } from "@/components/setup/bank-account/services/back-accounts.service";
import { itemdefinitions } from "@/components/setup/invoice-item-definition/services/invoice-item-definition";

export const useInvoice = (): any => {
  const dataItems: Array<Invoice> = [];
  let invoiceData: Invoice;

  const HEADERS = [
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
      width: "15%",
    },
    {
      text: "",
      align: "center",
      sortable: false,
      value: "amount_pending",
      width: "13%",
    },
  ];
  const HEADERS_INVOICE_DETAILS = [
    {
      text: "No",
      align: "start",
      sortable: false,
      value: "no",
      width: "5%",
    },
    {
      text: "Item Name",
      align: "start",
      sortable: false,
      value: "item",
      width: "30%",
    },

    {
      text: "Amount",
      align: "start",
      sortable: false,
      value: "amount",
      width: "15%",
    },
    {
      text: "Received Amount",
      align: "start",
      sortable: false,
      value: "received_amount",
      width: "15%",
    },
    {
      text: "Pending Amount ",
      align: "start",
      sortable: false,
      value: "balance_amount",
      width: "15%",
    },
  ];
  const RECEIPTHEADERS = [
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
      width: "15%",
    },
    {
      text: "Amount Received",
      align: "start",
      sortable: false,
      value: "amount_received",
      width: "17%",
    },
    {
      text: "Add Amount",
      align: "start",
      sortable: false,
      value: "amount_pending",
      width: "15%",
    },
  ];

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

    title: "Manage Invoice",
    modalTitle: "",
    headers: [
      {
        text: "Invoice Number",
        align: "start",
        sortable: false,
        value: "invoice_number",
      },
      { text: "Invoice Date", value: "date", sortable: true },

      {
        text: "Customer",
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
        text: "Ammount",
        align: "start",
        sortable: false,
        value: "amount",
      },
      {
        text: "Received Amount",
        align: "start",
        sortable: false,
        value: "received_amount",
      },
      {
        text: "Pending Amount",
        align: "start",
        sortable: false,
        value: "pending",
      },
    ],
    modal: false,
    deletemodal: false,
    invoicedetails: false,
    invoicereceipt: false,
    items: dataItems,
    itemsToFilter: [],
    formData: invoiceData,
    rows: ["10", "20", "50", "100"],
    itemTodelete: "",
    response: {},
    bankName: [],
    customers: [],
    itemdefinitions: [],
    invoicedata: invoiceData,
    bankaccounts: [],
    customer: [],
    invoice_items: [
      {
        invoice_item_definition_id: "",
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

    allgfscodes({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.bankName = response.data.data.data;
    });

    customers({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.customers = response.data.data.data;
    });

    itemdefinitions({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.itemdefinitions = response.data.data.data;
    });
  });

  const searchCategory = (categoryName) => {
    if (categoryName != null) {
      search({ invoice_number: categoryName.invoice_number }).then(
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
    (data.invoice_items = [
      {
        invoice_item_definition_id: "",
        amount: "",
      },
    ]),
      (data.modal = !data.modal);
  };

  const cancelInvoiceDialog = () => {
    data.invoicedetails = false;
  };

  const cancelInvoiceReceipt = () => {
    data.invoicereceipt = false;
    data.invoicedetails = true;
    data.invoicereceip.items = [];
  };

  const openInvoiceReceipt = (invoiceData: any) => {
    data.invoicedetails = false;
    data.invoicereceipt = true;

    data.customer = [invoiceData]; //mapping customer in autocomplete field
    data.invoicereceip.customer_id = invoiceData; //mapping customer in autocomplete for two way binding
    data.invoicereceip.invoice_id = invoiceData.id;
    data.invoicereceip.invoice_number = invoiceData.invoice_number;

    if (data.invoicedata.invoice_items) {
      data.invoicedata.invoice_items.forEach((value) => {
        const one_item = {
          invoicedAmount: value.amount,
          received: value.received_amount,
          itemName: value.definition.name,
          invoice_item_id: value.id,
          amount: "",
        };
        data.invoicereceip.items.push(one_item);
      });

      bankaccounts({ per_page: 2000 }).then((response: AxiosResponse) => {
        data.bankaccounts = response.data.data.data;
      });
    }
  };

  const bankName = computed(() => {
    return data.bankaccounts.map((account) => {
      account.fullName = `Account Number -${account.number}  ${account.bank} - ${account.branch}`;
      return account;
    });
  });

  const newInvoiceItem: any = computed(() => {
    return data.invoicedata.invoice_items.map((data, index) => ({
      ...data,
      index: ++index,
    }));
  });

  const invoicedAmount = ref(newInvoiceItem);

  const sumDebts = computed(() => {
    return {
      sumamount: invoicedAmount.value.reduce(function (sum, totalAmount) {
        return sum + Number(totalAmount.amount);
      }, 0),
      sumamountReceived: invoicedAmount.value.reduce(function (
        sum,
        totalAmount
      ) {
        return sum + Number(totalAmount.received_amount);
      },
      0),
      sumamountPending: invoicedAmount.value.reduce(function (
        sum,
        totalAmount
      ) {
        return sum + Number(totalAmount.amount - totalAmount.received_amount);
      },
      0),
    };
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
    data.formData.items = data.invoice_items;
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
  };

  const updateInvoiceItemDefinition = (data: any) => {
    update(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const createReceipt = () => {
    const invoiceItems = data.invoicereceip.items.filter((item) => item.cleared !== true);
    data.invoicereceip.items = invoiceItems;
    receiptcreate(data.invoicereceip).then(() => {
      data.invoicereceipt = false;
      reloadData();
      data.invoicereceip = {
        invoice_id: "",
        date: "",
        description: "",
        customer_id: "",
        bank_account_id: "",
        bank_reference_number: "",
        invoice_number: "",
        items: [],
      };
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
    data.invoice_items.push({
      invoice_item_definition_id: "",
      amount: "",
    });
  };

  const removeRow = (index: number) => {
    data.invoice_items.splice(index, 1);
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
    createReceipt,
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
    openInvoiceReceipt,
    HEADERS,
    RECEIPTHEADERS,
    bankName,
    HEADERS_INVOICE_DETAILS,
    newInvoiceItems,
    newInvoiceItem,
    sumDebts,
  };
};
