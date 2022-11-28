import { AxiosResponse } from "axios";
import { Invoice, Invoice2 } from "../types";
import { reactive, onMounted, ref, computed } from "vue";
import {
  get,
  create,
  update,
  destroy,
  regSearch as InvoiceSearch,
  receiptcreate,
  printInvoice,
  approveReversalInvoiceCouncilService,
} from "../services/invoice-council-approval";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import {
  customers,
  regSearch,
} from "@/components/receivables/customer/services/customer.service";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import { itemdefinitions } from "@/components/receivables/invoice-item-definition/services/invoice-item-definition";
import moment from "moment";
import stringToCurrency from "@/filters/money-to-number";

export const useInvoiceCouncilApproval = (): Record<string, unknown> => {
  const dataItems: Array<Invoice> = [];
  let invoiceData: Invoice;
  const invoiceData2 = {} as Invoice2;

  const HEADERS = [
    {
      text: "Item",
      align: "start",
      sortable: false,
      value: "invoice_number",
      width: "45%",
    },

    {
      text: "Amount",
      align: "start",
      sortable: false,
      value: "amount",
      width: "15%",
    },
    {
      text: "Actions",
      align: "center",
      sortable: false,
      value: "amount_pending",
      width: "5%",
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
    formData2: invoiceData2,
    formDataReceiptRejectionComment: "",
    valid: true,
    validate: {
      rejectionReason: [
        (v) => !!v || "Put a reason for jection of this invoice reversal",
      ],
    },
    genericrejectConfirmModel: false,
    genericDialogAction: null,
    genericConfirmModel: false,
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
    title: "Invoice Reversal",
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
      {
        text: "Actions",
        align: "right",
        sortable: false,
        value: "actions",
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
    itemTodelete: null,
    response: {},
    bankName: [],
    customers: [],
    itemdefinitions: [],
    invoiceData: invoiceData,
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
    reverseForm: {
      id: "",
      date: "",
    },
  });

  onMounted(() => {
    data.loading = true;
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      if (response.data && response.data.data != null) {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
      } else {
        data.items = [];
      }
      data.loading = false;
    });

    // allgfscodes({ per_page: 20000 }).then((response: AxiosResponse) => {
    //   data.bankName = response.data.data.data;
    // });

    // loadCustomer();

    // itemdefinitions({ per_page: 20000 }).then((response: AxiosResponse) => {
    //   data.itemdefinitions = response.data.data.data;
    // });
  });

  const rejectReversalICouncil = (model: any) => {
    data.formData2 = model;
    data.modalTitle = "Reject Reversal of this Invoice";
    data.genericDialogAction = rejectApproveInvoiceCouncilComplete;
    data.genericrejectConfirmModel = true;
  };
  const rejectApproveInvoiceCouncilComplete = () => {
    if (
      typeof data.formData2.approves == "undefined" ||
      data.formData2.approves.length === 0
    ) {
      return false;
    }
    let currentFlowable = null;
    const approves = data.formData2.approves;

    approves.forEach((flowable) => {
      if (
        flowable.council_appoved == null &&
        flowable.workflow == "REVERSAL_OF_INVOICE"
      ) {
        currentFlowable = flowable;
      }
    });

    if (currentFlowable == null) {
      return false;
    }
    const approveData = {
      approval: currentFlowable,
      approved: false,
      rejection_reason: data.formDataReceiptRejectionComment,
    };

    approveReversalInvoiceCouncilService(approveData).then(() => {
      data.genericrejectConfirmModel = false;
      reloadData();
    });
  };

  const approveReversalCouncil = (model: any) => {
    data.formData2 = model;
    data.modalTitle = "Accept to Approve Reversal of this Invoice";
    data.genericDialogAction = approveRejectionInvoiceCouncilComplete;
    data.genericConfirmModel = true;
  };
  const approveRejectionInvoiceCouncilComplete = () => {
    if (
      typeof data.formData2.approves == "undefined" ||
      data.formData2.approves.length === 0
    ) {
      return false;
    }
    let currentFlowable = null;
    const approves = data.formData2.approves;

    approves.forEach((flowable) => {
      if (
        flowable.council_appoved == null &&
        flowable.workflow == "REVERSAL_OF_INVOICE"
      ) {
        currentFlowable = flowable;
      }
    });

    if (currentFlowable == null) {
      return false;
    }
    const approveData = {
      approval: currentFlowable,
      approved: true,
    };

    approveReversalInvoiceCouncilService(approveData).then(() => {
      data.genericConfirmModel = false;
      reloadData();
    });
  };

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
      if (response.data && response.data.data != null) {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = {
          from,
          to,
          total,
          current_page,
          per_page,
          last_page,
        };
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
      } else {
        data.items = [];
      }
    });
  };

  const loadCustomer = () => {
    customers({ per_page: 20000, active: true }).then(
      (response: AxiosResponse) => {
        data.customers = response.data.data.data;
      }
    );
  };

  const reverseInvoice = (deleteId: any) => {
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

    if (data.invoiceData.invoice_items) {
      data.invoiceData.invoice_items.forEach((value) => {
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
    return data && data.invoiceData && data.invoiceData
      ? data.invoiceData.invoice_items.map((data, index) => ({
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
    data.formData = {} as Invoice;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemTodelete, data.reverseForm.date).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    const items = data.invoice_items.map((entry) => ({
      ...entry,
      amount: stringToCurrency(entry.amount),
    }));

    data.formData.items = items;
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

  const previewInvoice = (invoice: any) => {
    data.invoiceData = invoice;
    data.invoicedetails = true;
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

  const filterInvoice = () => {
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

  return {
    data,
    getData,
    createReceipt,
    addRow,
    removeRow,
    openDialog,
    cancelDialog,
    reverseInvoice,
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
    checkDublicate,
    searchCustomer,
    reanderSearched,
    print,
    filterInvoice,
    resetSearchText,
    approveReversalCouncil,
    rejectReversalICouncil,
  };
};
