import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import {
  createReport,
  getReports,
  deleteReport,
  updateReport,
  fetchReportTree,
  findReport,
} from "../services/report.services";

export const useNewReport = () => {
  const data = reactive({
    formData: {},
    code: "",
    editQuery: false,
    modal: false,
    deleteModal: false,
    report: null,
    title: "Manage Reports",
    modalTitle: "",
    item: {},
    reportOrders: [...Array(50).keys()],
    headers: [
      { text: "Order", value: "order" },
      { text: "Name", value: "name" },
      { text: "Parent", value: "parent" },
      { text: "Template URL", align: "start", sortable: false, value: "template_uri" },
      { text: "Level", value: "level" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    requestParams: {
      location_id: null,
      facility_id: null,
    },

    selectedReport: null,
    isOpen: false,
    entries: [],
    params: {
      asc: "order",
      from: null,
      to: null,
      total: null,
      current_page: null,
      per_page: null,
      last_page: null,
    },
    rows: ["5", "10", "20", "50", "100"],
  });

  const deleteItem = (item: number | string) => {
    const payload = item;
    deleteReport(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        fetchReports();
        data.item = {};
        data.isOpen = false;
      }
    });
  };

  const fetchReports = () => {
    getReports(data.params).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.params = { from, to, total, current_page, per_page, last_page, asc: "order" };
      data.entries = response.data.data.data;
    });
  };

  const loadReports = (params: any) => {
    const query = {
      ...params,
      asc: "order",
    };
    getReports(query).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.params = { from, to, total, current_page, per_page, last_page, asc: "order" };
      console.log(data.params);
      data.entries = response.data.data.data;
    });
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
    data.modal = true;
  };

  const cancelDialog = () => {
    data.modal = false;
    data.formData = {};
  };

  const update = (data) => {
    updateReport(data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        data.modal = false;
      }
    });
  };

  const create = (data) => {
    createReport(data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        data.modal = false;
      }
    });
  };

  const openConfirmDialog = (item: any) => {
    data.item = item;
    data.deleteModal = true;
  };

  const closeConfirmDialog = () => {
    data.deleteModal = true;
  };

  const save = () => {
    if (data.formData["id"]) {
      updateReport(data.formData).then((response: AxiosResponse) => {
        if (response.status === 200) {
          data.modal = false;
          fetchReports();
        }
      });
    } else {
      createReport(data.formData).then((response: AxiosResponse) => {
        if (response.status === 200) {
          fetchReports();
          data.modal = false;
        }
      });
    }
  };

  const getReportTree = async (location: any) => {
    fetchReportTree(data.requestParams).then((response: AxiosResponse) => {
      data.report = response.data.data;
    });
  };

  const remove = () => {
    deleteReport(data.item).then(() => {
      fetchReports();
      data.deleteModal = false;
    });
    data.item = {};
  };

  const getReport = async (report: any) => {
    findReport(report.id).then((response: AxiosResponse) => {
      data.selectedReport = response.data.data;
    });
  };

  onMounted(() => {
    fetchReports();
  });

  const cancelConfirmDialog = () => {
    data.deleteModal = false;
  };

  const openCodeEditor = (entry: any) => {
    console.log("entry", entry);
    data.formData = entry;
    data.editQuery = true;
  };

  const closeCodeEditor = () => {
    data.editQuery = false;
  };

  return {
    data,
    deleteItem,
    loadReports,
    save,
    update,
    openDialog,
    cancelDialog,
    openConfirmDialog,
    closeConfirmDialog,
    create,
    getReportTree,
    remove,
    getReport,
    cancelConfirmDialog,
    openCodeEditor,
    closeCodeEditor,
  };
};
