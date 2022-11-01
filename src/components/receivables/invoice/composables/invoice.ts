import { AxiosResponse } from "axios";
import { Invoice } from "../types";
import { reactive, onMounted, ref, computed } from "vue";
import {
  get,
  create,
  update,
  destroy,
  regSearch as InvoiceSearch,
  receiptcreate,
  printInvoice,
} from "../services/invoice";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import {
  customers,
  regSearch,
} from "@/components/receivables/customer/services/customer.service";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import { itemdefinitions } from "@/components/receivables/invoice-item-definition/services/invoice-item-definition";
import moment from "moment";
import stringToCurrency from "@/filters/money-to-number";

export const useInvoice = (): Record<string, unknown> => {
  const dataItems: Array<Invoice> = [];
  let invoiceData: Invoice;

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
  });

  onMounted(async () => {
    data.loading = true;

    const response: AxiosResponse = await get({ per_page: 10 });
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.loading = false;

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
        .data,
        dex: ++index,
      )
      : "";
  });

  const invoicedAmount = ref(newInvoiceItem);

  const sumDebts = computed(() => {
    return {
      sumamount: invoicedAmount.value.reduce(functionsum, totalAmount) {
      turn sum + Number(totalAmount.amount);
     0),
    mamountReceived: invoicedAmount.value.reduce(function
      m,
      talAmount
    {
    rn sum + Number(totalAmount.received_amount);
  
  
  mountPending: invoicedAmount.value.reduce(function
    
    lAmount
  
    rn sum + Number(totalAmount.amount - totalAmount.received_amount);
  
  

  });

nst cancelConfirmDialog = () => {
  ta.formData = {} as Invoice;
  ta.deletemodal = false;


nst remove = () => {
  stroy(data.itemTodelete).then(() => {
    loadData();
    ta.deletemodal = false;
  ;


nst save = () => {
  nst items = data.invoice_items.map((entry) => ({
    .entry,
    ount: stringToCurrency(entry.amount),
  );

  ta.formData.items = items;
   (data.formData.id) {
    dateInvoiceItemDefinition(data.formData);
  else {
    eateInvoice(data.formData);
  


nst openDialog = (formData?: any) => {
   (formData.id) {
    ta.formData = formData;
    ta.modalTitle = "Update";
  else {
    ta.formData = {} as Invoice;
    ta.modalTitle = "Create";
  
  ta.modal = !data.modal;


nst updateInvoiceItemDefinition = (data: any) => {
  date(data).then(() => {
    loadData();
    ncelDialog();
  ;


nst createReceipt = () => {
  nst invoiceItems = data.invoicereceip.items.filter(
    tem) => item.cleared !== true
  
  ta.invoicereceip.items = invoiceItems;
  ceiptcreate(data.invoicereceip).then(() => {
    ta.invoicereceipt = false;
    loadData();
    ta.invoicereceip = {
      voice_id: "",
      te: "",
      scription: "",
      stomer_id: "",
      nk_account_id: "",
      nk_reference_number: "",
      voice_number: "",
      ems: [],
    
  ;


nst createInvoice = (data: any) => {
  eate(data).then(() => {
    loadData();
    ncelDialog();
  ;


nst getData = (params: any) => {
  ta.response = params;
  t(params).then((response: AxiosResponse) => {
    ta.response = response.data.data;
    ta.items = response.data.data.data;
  ;


nst addRow = () => {
  ta.invoice_items.push({
    voice_item_definition_id: "",
    ount: "",
  ;


nst checkDublicate = (value, index) => {
  nst obj = data.invoice_items.filter(
    ) => o.invoice_item_definition_id === value
  
   (obj.length < 2) {
     addRow();
  else {
    ta.invoice_items.splice(index, 10000);
  


nst removeRow = (index: number) => {
  ta.invoice_items.splice(index, 1);


nst previewInvoice = (invoice: any) => {
  ta.invoiceData = invoice;
  ta.invoicedetails = true;


nst newInvoiceItems = computed(() => {
   (data.invoicereceip) {
    turn data.invoicereceip.items.map((item) => {
      em.cleared = item.invoicedAmount == item.received ? true : false;
      turn item;
    ;
  
;

nst searchCustomer = (item: string) => {
   (item) {
    nst regSearchTerm = item ? item : data.searchTerm;
    gSearch({
      tive: true,
      gSearch: regSearchTerm,
    .then((response: AxiosResponse) => {
      ta.customers = response.data.data.data;
    ;
  else {
    adCustomer();
  


nst print = (id: number) => {
  intInvoice(id);


nst filterInvoice = () => {
   (data.searchTerm.length >= 3) {
    t({ regSearch: data.searchTerm }).then((response: AxiosResponse) => {
      nst { from, to, total, current_page, per_page, last_page } =
        sponse.data.data;
      ta.response = { from, to, total, current_page, per_page, last_page };
      ta.items = response.data.data.data;
    ;
  
   (data.searchTerm.length === 0) {
    t({ per_page: 10 }).then((response: AxiosResponse) => {
      nst { from, to, total, current_page, per_page, last_page } =
        sponse.data.data;
      ta.response = { from, to, total, current_page, per_page, last_page };
      ta.items = response.data.data.data;
    ;
  


nst resetSearchText = () => {
  ta.searchTerm = "";
  t({ per_page: 10 }).then((response: AxiosResponse) => {
    nst { from, to, total, current_page, per_page, last_page } =
      sponse.data.data;
    ta.response = { from, to, total, current_page, per_page, last_page };
    ta.items = response.data.data.data;
  ;


turn {
  ta,
  tData,
  eateReceipt,
  dRow,
  moveRow,
  enDialog,
  ncelDialog,
  verseInvoice,
  tInvoiceItemdefinition,
  dateInvoiceItemDefinition,
  ve,
  loadData,
  move,
  ncelConfirmDialog,
  archCategory,
  eviewInvoice,
  ncelInvoiceDialog,
  ncelInvoiceReceipt,
  enInvoiceReceipt,
  ADERS,
  CEIPTHEADERS,
  nkName,
  ADERS_INVOICE_DETAILS,
  wInvoiceItems,
  wInvoiceItem,
  mDebts,
  eckDublicate,
  archCustomer,
  anderSearched,
  int,
  lterInvoice,
  setSearchText,

};
