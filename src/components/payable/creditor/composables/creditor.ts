import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import moment from "moment";
import { get, find } from "../services/creditor.services";
import { Creditor } from "../types/Creditor";

export const useCreditor = (): any => {
  const dataItems: Array<Creditor> = [];
  const creditorData = {} as Creditor;

  const data = reactive({
    title: "Creditors",
    valid: false,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Reference Number",
        align: "start",
        sortable: false,
        value: "reference_no",
      },
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "date",
      },
      {
        text: "Supplier",
        align: "start",
        sortable: false,
        value: "supplier.name",
      },
      {
        text: "Amount",
        align: "start",
        sortable: false,
        value: "amount",
      },
      {
        text: "Amount Paid",
        align: "start",
        sortable: false,
        value: "amount_paid",
      },
      {
        text: "Age",
        align: "start",
        sortable: false,
        value: "age",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
    ],
    items: dataItems,
    itemsToFilter: [],
    formData: creditorData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    searchTerm: "",
    coat: "/coat_of_arms.svg.png",
    pvDetails: { printDate: "" },
    CreditorModal: false,
  });

  onMounted(() => {
    getTableData();
  });

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const getData = (params: Creditor) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const payablePrintHeader = [
    {
      text: "Account code",
      align: "start",
      sortable: false,
      width: "60%",
    },
    {
      text: "Fund source",
      align: "start",
      sortable: false,
      width: "",
    },
    {
      text: "Account description",
      align: "start",
      sortable: false,
      width: "",
    },
    {
      text: "Amount",
      align: "end",
      sortable: false,
      value: "",
      width: "",
    },
  ];
  const previewCreditor = (id: number) => {
    find(id).then((response: AxiosResponse) => {
      data.pvDetails = response.data.data;
      data.pvDetails.printDate = moment(new Date()).format(
        "DD/MM/YYYY H:mm:ss"
      );
      data.CreditorModal = !data.CreditorModal;
    });
  };

  const cancelPreviewDialog = () => {
    data.CreditorModal = !data.CreditorModal;
  };

  return {
    data,
    getData,
    payablePrintHeader,
    cancelPreviewDialog,
    previewCreditor,
  };
};
