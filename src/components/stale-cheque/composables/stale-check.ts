import { AxiosResponse } from "axios";
import { StaleCheque } from "../types";
import { computed, onMounted, reactive, ref } from "vue";
import { get, regSearch as InvoiceSearch } from "../services/stale-cheque";

export const useStaleCheque = (): Record<string, unknown> => {
  const dataItems: Array<StaleCheque> = [];
  let StaleChequeType: StaleCheque;

  interface Header {
    text: string;
    align?: string;
    sortable: boolean;
    value: string;
    width?: number;
  }

  const title: string = "Manage Stale Cheque";
  let modalTitle: string;
  const rows: Array<string> = ["10", "20", "50", "100"];
  const headers: Array<Header> = [
    { text: "Date", value: "payment_date", sortable: true },
    {
      text: "Payment #",
      align: "start",
      sortable: false,
      value: "reference_no",
    },
    {
      text: "Payee",
      align: "start",
      sortable: false,
      value: "payee",
      width: 600,
    },
    {
      text: "Payee",
      align: "start",
      sortable: false,
      value: "payee",
    },
    {
      text: "Amount [ TZS ]",
      align: "right",
      sortable: false,
      value: "amount",
    },
  ];

  const data = reactive({
    formData: StaleChequeType,
    title,
    headers,
    modalTitle,
    items: dataItems,
    itemsToFilter: [],
    rows,
    itemTodelete: "",
    response: {},
    loading: false,
    searchTerm: "",
    modal: false,
  });

  onMounted(() => {
    data.loading = true;
    fetchData();
  });

  const mapPayments = (payments) => {
    return payments.map((p) => ({
      ...p,
      date: p.payment.payment_date,
      payee: p.payee ? p.payee : "Lucas Gervs",
      reference_no: p.payment.reference_no,
    }));
  };

  const fetchData = async () => {
    const response = await get({ per_page: 10 });
    const { from, to, total, current_page, per_page, last_page } =
      response.data.data;
    data.items = mapPayments(response.data.data.data);
    console.log(response.data.data.data);
    data.itemsToFilter = response.data.data.data;
    data.loading = false;
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };
  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Save";
    }
    data.modal = !data.modal;
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.formData = {} as StaleCheque;
    data.modal = !data.modal;
  };
  const save = () => {
    console.log("saveStale");
  };

  return {
    data,
    getData,
    reloadData,
    openDialog,
    cancelDialog,
    save,
  };
};
