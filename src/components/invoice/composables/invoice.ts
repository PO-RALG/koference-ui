import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  Invoice,
  FormData,
  InvoiceReceipt,
  Item,
  ReceiptItem,
  newInvoice,
  newFormData,
  newInvoiceReceipt,
} from "../types";
import { get, create, update, destroy, search, viewinvoice, receiptcreate } from "../services/invoice";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import { customers } from "@/components/setup/customer/services/customer.service";
import { bankaccounts } from "@/components/setup/bank-account/services/back-accounts.service";
import { itemdefinitions } from "@/components/setup/invoice-item-definition/services/invoice-item-definition";
import store from "@/store";

export const useInvoice = (): any => {
  const dataItems: Array<Invoice> = [];
  const FormData: FormData = newFormData();
  const invoiceData: Invoice = newInvoice();
  const InvoiceReceipt: InvoiceReceipt = newInvoiceReceipt();
  const HEADERS = [
    {
      text: "Item",
      align: "start",
      sortable: false,
      value: "invoice_number",
      width: "50%",
    },
    {
      text: "Amount",
      align: "start",
      sortable: false,
      value: "amount",
      width: "35%",
    },
    {
      text: "",
      align: "center",
      sortable: false,
      value: "amount_pending",
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
    invoiceReceipt: InvoiceReceipt,
    invoicereceip: InvoiceReceipt,
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
        text: "Ammount",
        align: "start",
        sortable: false,
        value: "amount",
      },
      {
        text: "Amount Paid",
        align: "start",
        sortable: false,
        value: "amount",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
    ],
    modal: false,
    deletemodal: false,
    invoicedetails: false,
    invoicereceipt: false,
    items: dataItems,
    itemsToFilter: [],
    formData: FormData,
    rows: ["10", "20", "50", "100"],
    itemTodelete: "",
    response: {},
    gfscodes: [],
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

    allgfscodes({ per_page: 2000 }).then((response: any) => {
      data.gfscodes = response.data.data.data;
    });

    customers({ per_page: 2000 }).then((response: any) => {
      data.customers = response.data.data.data;
    });

    itemdefinitions({ per_page: 2000 }).then((response: any) => {
      data.itemdefinitions = response.data.data.data;
    });
  });

  const searchCategory = (categoryName) => {
    if (categoryName != null) {
      search({ invoice_number: categoryName.invoice_number }).then((response: any) => {
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
    data.formData = {} as FormData;
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
    data.invoicedetails = false;
    data.invoicereceip.items = [];
  };

  const openInvoiceReceipt = (invoiceData: any) => {
    console.log("receipt", invoiceData);
    data.invoicedetails = false;
    data.invoicereceipt = true;
    data.customer = [invoiceData];
    data.invoicereceip.customer_id = invoiceData;
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

      bankaccounts({ per_page: 2000 }).then((response: any) => {
        data.bankaccounts = response.data.data.data;
      });
    }
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as FormData;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemTodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    createInvoice(data.formData);
  };

  const initializeFormData = (): FormData => {
    return (data.formData = newFormData());
  };

  const openDialog = () => {
    const user = store.getters["Auth/getCurrentUser"];
    initializeFormData();
    data.formData.facility_id = user.facility_id;
    data.modalTitle = "Create";
    data.modal = !data.modal;
  };

  const updateInvoiceItemDefinition = (data: any) => {
    update(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const createReceipt = () => {
    receiptcreate(data.invoicereceip);
  };

  const createInvoice = (data) => {
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
    data.formData.items.push({
      invoice_item_definition_id: "",
      amount: "",
    });
  };

  const removeRow = (index: number) => {
    data.formData.items.splice(index, 1);
  };

  const previewInvoice = (item) => {
    const {
      id,
      amount,
      invoice_number,
      date,
      description,
      customer_id,
      customer,
      bank_account_id,
      bank_reference_number,
      items,
    } = item;

    const invoiceItems: ReceiptItem = items.map((entry) => {
      return {
        name: entry.definition.name,
        amount,
        invoice_item_id: entry.id,
      };
    });

    data.invoiceReceipt = {
      id,
      amount,
      invoice_number,
      date,
      customer,
      description,
      customer_id,
      bank_account_id,
      bank_reference_number,
      items: invoiceItems,
    };

    viewinvoice(item).then((response: AxiosResponse) => {
      data.invoicedata = response.data.data;
      data.invoicedetails = true;
    });
  };

  const items = computed(() => {
    return data.items.map((item) => {
      return {
        id: item.id,
        amount: item.amount,
        invoice_number: item.invoice_number,
        date: item.date,
        description: item.description,
        customer_id: item.customer_id,
        customer: { id: item.customer.id, name: item.customer.name },
        bank_account_id: item.bank_account_id,
        bank_reference_number: item.bank_reference_number,
        items: item.invoice_items,
      };
    });
  });

  return {
    items,
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
  };
};
