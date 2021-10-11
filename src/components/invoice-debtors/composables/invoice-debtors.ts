import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { InvoiceDebtor } from "../types/InvoiceDebtor";
import { Invoice } from "../../invoice/types";
import { get, search } from "../services/invoice-debtor.service";
import {
  search as customerInvoices,
  viewinvoice,
} from "../../invoice/services/invoice";

export const useInvoiceDebtor = (): any => {
  const invoiceDebtorData: Array<InvoiceDebtor> = [];
  const invoiceData: Array<Invoice> = [];

  const data = reactive({
    title: "Manage Invoice Debtors",
    modalTitle: "",
    headers: [
      { text: "Actions", align: "start", value: "actions", sortable: false },

      { text: "Name", align: "start", sortable: false, value: "name" },
      { text: "Email", align: "start", sortable: false, value: "email" },

      { text: "Address", align: "start", sortable: false, value: "address" },
      { text: "Phone", align: "start", sortable: false, value: "phone" },
    ],

    HEADERS_INVOICE_DETAILS: [
      {
        text: "Item Name",
        align: "start",
        sortable: false,
        value: "invoice_number",
        width: "30%",
      },

      {
        text: "Amount",
        align: "end",
        sortable: false,
        value: "amount",
        width: "15%",
      },
      {
        text: "Received Amount",
        align: "end",
        sortable: false,
        value: "amount",
        width: "15%",
      },
      {
        text: "Pending Amount ",
        align: "end",
        sortable: false,
        value: "amount",
        width: "15%",
      },
    ],

    invoice_headers: [
      {
        text: "Invoice Number",
        sortable: false,
        value: "invoice_number",
        width: "17%",
      },
      { text: "Invoice Date", value: "date", sortable: true },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: "Amount",
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

    viewInvoiceDialog: false,
    items: invoiceDebtorData,
    itemsToFilter: [],
    rows: ["10", "20", "50", "100"],
    response: {},
    invoices: invoiceData,
    selectedDebtor: {},
    invoiceData: invoiceData,
    invoicedetails: false,
  });

  onMounted(() => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  });

  computed(() => {
    return "test";
  });

  const searchCategory = (categoryName) => {
    console.log("argument", categoryName);

    if (categoryName != null) {
      search({ email: categoryName.email }).then((response: any) => {
        data.items = response.data.data.data;
      });
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

  const viewInvoice = (debtor: any) => {
    data.selectedDebtor = debtor;
    const params = { customer_id: debtor.id };
    customerInvoices(params).then((response: AxiosResponse) => {
      if (response.data.status === 200) {
        data.viewInvoiceDialog = true;
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.invoices = response.data.data.data;
      }
    });
  };

  const getInvoiceDebtor = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.viewInvoiceDialog = false;
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const previewInvoice = (item: any) => {
    viewinvoice(item).then((response: AxiosResponse) => {
      data.invoiceData = response.data.data;
      data.invoicedetails = true;
      data.viewInvoiceDialog = false;
    });
  };

  const cancelInvoiceDialog = () => {
    data.invoicedetails = false;
    data.viewInvoiceDialog = true;
  };

  return {
    data,
    getData,
    cancelDialog,
    viewInvoice,
    getInvoiceDebtor,
    reloadData,
    searchCategory,
    previewInvoice,
    cancelInvoiceDialog,
  };
};
