import { AxiosResponse } from "axios";
import { StaleCheque } from "../types";
import { reactive, onMounted, ref, computed } from "@vue/composition-api";
import {
  get,
  create,
  update,
  destroy,
  regSearch as InvoiceSearch,
  receiptcreate,
  printInvoice,
} from "../services/stale-check";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import {
  customers,
  regSearch,
} from "@/components/receivables/customer/services/customer.service";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import { itemdefinitions } from "@/components/receivables/invoice-item-definition/services/invoice-item-definition";
import moment from "moment";

export const useStaleCheque = (): Record<string, unknown> => {
  const dataItems: Array<StaleCheque> = [];
  let paymentData: StaleCheque;

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
    maxDate: moment(new Date()).format("YYYY-MM-DD"),
    title: "Manage StaleCheck",
    modalTitle: "",
    headers: [
      {
        text: "Voucher Number",
        align: "start",
        sortable: false,
        value: "voucher_number",
      },
      { text: "StaleCheck Date", value: "date", sortable: true },

      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: "Bank",
        align: "start",
        sortable: false,
        value: "bank_account",
      },
      {
        text: "Amount [ TZS ]",
        align: "start",
        sortable: false,
        value: "amount",
      },
    ],
    modal: false,
    deletemodal: false,
    paymentdetails: false,
    invoicereceipt: false,
    items: dataItems,
    itemsToFilter: [],
    formData: paymentData,
    rows: ["10", "20", "50", "100"],
    itemTodelete: "",
    response: {},
    bankName: [],
    customers: [],
    itemdefinitions: [],
    paymentData: paymentData,
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
    searchTerm: "",
    search: "",
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

    allgfscodes({ per_page: 20000 }).then((response: AxiosResponse) => {
      data.bankName = response.data.data.data;
    });

    loadCustomer();

    itemdefinitions({ per_page: 20000 }).then((response: AxiosResponse) => {
      data.itemdefinitions = response.data.data.data;
    });
  });

  const searchCategory = (categoryName: any) => {
    // console.log("categoryname", categoryName.invoice_number);
    if (categoryName != null && categoryName.length >= 2) {
      InvoiceSearch({ regSearch: categoryName }).then(
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
  const reanderSearched = (categoryName: any) => {
    console.log("categoryname", categoryName);
    if (categoryName != null) {
      InvoiceSearch({ regSearch: categoryName.invoice_number }).then(
        (response: AxiosResponse) => {
          data.items = response.data.data.data;
        }
      );
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

  const loadCustomer = () => {
    customers({ per_page: 20000, active: true }).then(
      (response: AxiosResponse) => {
        data.customers = response.data.data.data;
      }
    );
  };

  const deleteInvoiceItemdefinition = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemTodelete = deleteId;
    data.paymentdetails = false;
  };

  const getInvoiceItemdefinition = () => {
    get(data);
  };

  const cancelDialog = () => {
    data.formData = {} as StaleCheque;
    (data.invoice_items = [
      {
        invoice_item_definition_id: "",
        amount: "",
      },
    ]),
      (data.modal = !data.modal);
  };

  const cancelInvoiceDialog = () => {
    data.paymentdetails = false;
  };

  const cancelInvoiceReceipt = () => {
    data.invoicereceipt = false;
    data.paymentdetails = true;
    data.invoicereceip.items = [];
  };

  const openInvoiceReceipt = (paymentData: any) => {
    data.paymentdetails = false;
    data.invoicereceipt = true;

    data.customer = [paymentData]; //mapping customer in autocomplete field
    data.invoicereceip.customer_id = paymentData; //mapping customer in autocomplete for two way binding
    data.invoicereceip.invoice_id = paymentData.id;
    data.invoicereceip.invoice_number = paymentData.invoice_number;

    if (data.paymentData.invoice_items) {
      data.paymentData.invoice_items.forEach((value) => {
        const one_item = {
          invoicedAmount: value.amount,
          received: value.received_amount,
          itemName: value.definition.name,
          invoice_item_id: value.id,
          amount: "",
        };
        data.invoicereceip.items.push(one_item);
      });

      getBankAccounts({ per_page: 2000 }).then((response: AxiosResponse) => {
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
    return data && data.paymentData && data.paymentData
      ? data.paymentData.invoice_items.map((data, index) => ({
          ...data,
          index: ++index,
        }))
      : "";
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
    data.formData = {} as StaleCheque;
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
      data.formData = {} as StaleCheque;
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
    const invoiceItems = data.invoicereceip.items.filter(
      (item) => item.cleared !== true
    );
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

  const checkDublicate = (value, index) => {
    const obj = data.invoice_items.filter(
      (o) => o.invoice_item_definition_id === value
    );
    if (obj.length < 2) {
      // addRow();
    } else {
      data.invoice_items.splice(index, 10000);
    }
  };

  const removeRow = (index: number) => {
    data.invoice_items.splice(index, 1);
  };

  const previewPayment = (paymentData: any) => {
    data.paymentData = paymentData;
    data.paymentdetails = true;
  };

  const newInvoiceItems = computed(() => {
    if (data.invoicereceip) {
      return data.invoicereceip.items.map((item) => {
        item.cleared = item.invoicedAmount == item.received ? true : false;
        return item;
      });
    }
  });

  const searchCustomer = (item: string) => {
    if (item) {
      const regSearchTerm = item ? item : data.searchTerm;
      regSearch({
        active: true,
        regSearch: regSearchTerm,
      }).then((response: AxiosResponse) => {
        data.customers = response.data.data.data;
      });
    } else {
      loadCustomer();
    }
  };

  const print = (id: number) => {
    printInvoice(id);
  };

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
    previewPayment,
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
    checkDublicate,
    searchCustomer,
    reanderSearched,
    print,
  };
};
