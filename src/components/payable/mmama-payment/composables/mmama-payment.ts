import { reactive, onMounted, ref } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  get,
  create,
  update,
  destroy,
  startFinancialYear,
  search,
} from "../services/mmamapayment.service";
import { FinancialYear } from "../types/FinancialYear";

export const useMmamaPayment = (): any => {
  const dataItems: Array<FinancialYear> = [];
  let financialYearData: FinancialYear;

  const data = reactive({
    title: "M Mama Payments",
    modalTitle: "",
    headers: [
      {
        text: "Payment Date",
        align: "start",
        sortable: false,
        value: "payment_date",
      },
      { text: "Driver Name", value: "driver_name" },
      { text: "Phone Number", value: "phone_number" },
      { text: "Amount Paid", value: "amount_paid", sortable: false },
      { text: "Facility From", value: "facility_from", sortable: false },
      { text: "Facility To", value: "facility_to", sortable: false },
      // { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: financialYearData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  };

  const searchFinancialYear = (categoryName) => {
    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
        data.items = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const toggleStatus = (item) => {
    startFinancialYear(item).then((response: any) => {
      if (response.status === 200) {
        reloadData();
      }
    });
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const deleteFinancialYear = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const getFinancialYear = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as FinancialYear;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as FinancialYear;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    if (data.formData.id) {
      updateFinancialYear(data.formData);
    } else {
      createFinancialYear(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as FinancialYear;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateFinancialYear = (data: any) => {
    update(data).then((response) => {
      if (response.status === 200) {
        reloadData();
        cancelDialog();
      }
    });
  };

  const createFinancialYear = (data: any) => {
    create(data).then((response) => {
      if (response.status === 200) {
        reloadData();
        cancelDialog();
      }
    });
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  return {
    data,
    getData,
    openDialog,
    cancelDialog,
    deleteFinancialYear,
    getFinancialYear,
    updateFinancialYear,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    toggleStatus,
    searchFinancialYear,
  };
};
