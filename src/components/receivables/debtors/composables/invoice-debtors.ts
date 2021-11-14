import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import { get } from "../services/invoice-debtor.service";

export const useDebtor = (): any => {
  const data = reactive({
    title: "Manage Debtors",
    modalTitle: "",
    headers: [
      {
        text: "Reference Number",
        align: "start",
        sortable: false,
        value: "invoice_number",
      },
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "date",
      },
      {
        text: "Customer",
        align: "start",
        sortable: false,
        value: "customer.name",
      },
      {
        text: "Age < 30 days",
        align: "end",
        sortable: false,
        value: "below_30",
      },
      {
        text: "30 days > Age < 60 days",
        align: "end",
        sortable: false,
        value: "between_30_60",
      },
      {
        text: "60 days > Age < 90 days",
        align: "end",
        sortable: false,
        value: "between_60_90",
      },
      {
        text: "60 days > Age < 90 days",
        align: "end",
        sortable: false,
        value: "between_90_120",
      },
      {
        text: "Age > 120 days",
        align: "end",
        sortable: false,
        value: "above_120",
      },
    ],

    ITEM_DETAILS: [
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
        value: "name",
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
    viewInvoiceDialog: false,
    rows: ["10", "20", "50", "100"],
    response: {},
    selectedInvoice: null,
    showInvoiceDialog: false,
    invoices: [],
  });

  onMounted(() => {
    getTableData();
  });

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.invoices = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  };

  const getInvoiceDebtor = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.invoices = response.data.data.data;
    });
  };

  const previewInvoice = (invoice: any) => {
    data.selectedInvoice = invoice;
    data.showInvoiceDialog = true;
  };

  const cancelInvoiceDialog = () => {
    data.showInvoiceDialog = false;
  };

  const invoices = computed(() => {
    return data.invoices.map((invoice, index) => {
      return {
        ...invoice,
        index: index++,
        totalAmt: parseFloat(invoice.amount),
        receivedAmt: getReceivedAmount(invoice.receipts),
        pendingAmt: getPendingAmount(invoice),
        invoiceItems: getItems(invoice),
      }
    })
  });

  const getItems = (invoice: any) => {
    return invoice.invoice_items.map((item, index) => {
      return {
        ...item,
        index: index++,
        amount: parseFloat(item.amount),
        received_amount: parseFloat(item.received_amount),
        name: (item.definition.name),
      }
    })
  };

  const getReceivedAmount = (receipts: any[]) => {
    if (receipts.length > 0) {
      return receipts.reduce((acc, receipt) => {
        return acc + parseFloat(receipt.amount);
      }, 0);
    } else {
      return 0;
    }
  };

  const getPendingAmount = (invoice: any) => {
    const receivedAmt = getReceivedAmount(invoice.receipts);
    const invoiceAmt = parseFloat(invoice.amount);
    return invoiceAmt - receivedAmt;
  };


  return {
    data,
    getData,
    getInvoiceDebtor,
    previewInvoice,
    cancelInvoiceDialog,
    invoices,
  };
};
