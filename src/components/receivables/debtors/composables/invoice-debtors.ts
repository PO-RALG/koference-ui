import { reactive, ref, onMounted, computed } from "@vue/composition-api";
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
  let invoiceData: Invoice;

  // const invoiceData: Array<Invoice> = [];

  const data = reactive({
    title: "Manage Invoice Debtors",
    coat: "/coat_of_arms.svg.png",
    modalTitle: "",
    headers: [
      { text: "Customer", align: "start", sortable: false, value: "customer" },

      {
        text: "Invoice Number",
        align: "start",
        sortable: false,
        value: "invoice_number",
      },
      { text: "Age (days)", align: "start", sortable: false, value: "age" },
      { text: "Action", align: "start", sortable: false, value: "actions" },
    ],

    HEADERS_INVOICE_DETAILS: [
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
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  });

  const newDetorsWithin30Days: any = computed(() => {
    return data.items
      .filter((item) => item.age >= 0 && item.age <= 29)
      .map((data, index) => ({
        ...data,
        index: ++index,
      }));
  });

  const newDetorsBelow30Days: any = computed(() => {
    return data.items
      .filter((item) => item.age >= 30 && item.age <= 90)
      .map((data, index) => ({
        ...data,
        index: ++index,
      }));
  });
  const newDetorsGreater90Days: any = computed(() => {
    return data.items
      .filter((item) => item.age >= 31 && item.age >= 91)
      .map((data, index) => ({
        ...data,
        index: ++index,
      }));
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

  const newInvoiceItem: any = computed(() => {
    return data.invoiceData.invoice_items.map((data, index) => ({
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

  return {
    newInvoiceItem,
    sumDebts,
    invoicedAmount,
    data,
    getData,
    cancelDialog,
    viewInvoice,
    getInvoiceDebtor,
    reloadData,
    searchCategory,
    previewInvoice,
    cancelInvoiceDialog,
    newDetorsWithin30Days,
    newDetorsBelow30Days,
    newDetorsGreater90Days,
  };
};
