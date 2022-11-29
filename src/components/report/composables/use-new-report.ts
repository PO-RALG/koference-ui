import { reactive, onMounted, computed } from "vue";
import { AxiosResponse } from "axios";
import {
  createReport,
  getReports,
  deleteReport,
  updateReport,
  fetchReportTree,
  findReport,
  updateQuery,
  allreportFilters,
  toggleActive,
} from "../services/report.services";

export const useNewReport = () => {
  const data = reactive({
    reportFilters: [],
    formData: {
      report_parameters: "",
    },
    selectedFilters: [],
    // formData: {},
    code: "",
    query: null,
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
      {
        text: "Template URL",
        align: "start",
        sortable: false,
        value: "template_uri",
      },
      { text: "Level", value: "level" },
      { text: "Activations", value: "activations", sortable: false },
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
    status: "",
    show: false,
  });
  const closeActivationDialog = () => {
    data.item = null;
    data.show = false;
    data.status = null;
    data.report = null;
    init();
  };

  const message = computed(() => {
    return `Are you sure you want to ${data.status} this report?`;
  });

  const toggleStatus = () => {
    toggleActive(data.report).then((response) => {
      if (response.status === 200) {
        closeActivationDialog();
        init();
      }
    });
  };
  const upsert = (array, item) => {
    const idx = array.findIndex((_item: any) => _item.id === item.id);
    if (idx > -1) {
      array.splice(idx, 1);
    } else {
      array.push(item);
    }
    return array;
  };

  const loadReportFilters = () => {
    allreportFilters({ size: 1000 }).then((response: any) => {
      // console.log("all filters", response.data.data);
      data.reportFilters = response.data.data;
    });
  };

  const onChangeList = ({ source, destination }): void => {
    const filtersIds = destination.map((s) => s.id);

    destination.forEach((item) => {
      console.log("item", filtersIds);
      data.reportFilters = upsert(source, item);
    });
    // console.log("item", filtersIds);

    data.formData.report_parameters = filtersIds;
  };

  const selectedFilters = computed(() => {
    return data.formData.report_parameters || [];
  });

  const deleteItem = (item: number | string) => {
    const payload = item;
    deleteReport(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        init();
        data.item = {};
        data.isOpen = false;
      }
    });
  };
  const openActivationDialog = (report: any) => {
    console.log("report.active", report);
    data.status = report.active ? "Activate" : "De-Activate";
    data.report = report;
    data.show = true;
  };
  const init = () => {
    getReports(data.params).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.params = {
        from,
        to,
        total,
        current_page,
        per_page,
        last_page,
        asc: "order",
      };
      data.entries = response.data.data.data;
    });
  };

  const loadReports = (params: any) => {
    const query = {
      ...params,
      asc: "order",
    };
    getReports(query).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.params = {
        from,
        to,
        total,
        current_page,
        per_page,
        last_page,
        asc: "order",
      };
      console.log(data.params);
      data.entries = response.data.data.data;
    });
  };

  const openDialog = (formData?: any) => {
    loadReportFilters();
    if (formData.id) {
      data.selectedFilters = formData.report_parameters;
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
    data.modal = true;
  };

  const cancelDialog = () => {
    data.modal = false;
    data.formData = null;
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
          init();
        }
      });
    } else {
      createReport(data.formData).then((response: AxiosResponse) => {
        if (response.status === 200) {
          init();
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
      init();
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
    init();
  });

  const cancelConfirmDialog = () => {
    data.deleteModal = false;
  };

  const openCodeEditor = (entry: any) => {
    data.selectedReport = entry;
    data.formData = entry;
    data.editQuery = true;
  };

  const saveReportQuery = () => {
    const payload = {
      id: data.selectedReport.id,
      query: data.query,
    };
    console.log(payload);
    updateQuery(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        init();
        closeCodeEditor();
      }
    });
  };

  const closeCodeEditor = () => {
    data.editQuery = false;
  };

  const reportTitle = computed(() => {
    if (data.selectedReport) {
      return `Edit ${data.selectedReport.name} ${data.selectedReport.level.name} Report Query`;
    } else {
      return "Edit Report Query";
    }
  });

  const onChange = (newQuery: string) => {
    data.query = newQuery;
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
    saveReportQuery,
    reportTitle,
    onChange,
    onChangeList,
    loadReportFilters,
    selectedFilters,
    openActivationDialog,
    closeActivationDialog,
    toggleStatus,
    message,
  };
};
