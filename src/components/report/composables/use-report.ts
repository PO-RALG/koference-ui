import { reactive, onMounted, set, computed } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";

import { fetchReportTree, getReports, createReport, updateReport, deleteReport } from "../services/report.services";
import { get as fetchLocationTree, getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";
import { get as getLevels } from "@/components/admin-area/level/services/level-services";

import { AxiosResponse } from "axios";
import { useRoute } from "vue2-helpers/vue-router";
import { getCurrentUser } from "@/middleware";

export const useReport = (actionType?: string): any => {
  const route = useRoute();
  const currentUser = getCurrentUser();

  const data = reactive({
    location: {},
    infoMessage: "",
    isInfoDialogOpen: false,
    reportSelected: false,
    requestParams:{
      location_id: null,
      facility_id: null,
    },
    report: null,
    selectedLocation: {},
    item: {},
    selectedReport: null,
    currentItem: null,
    node: null,
    formData: {},
    reportOrders: [...Array(50).keys()],
    headers: [
      { text: "Order", value: "order" },
      { text: "Name", value: "name" },
      { text: "Parent", value: "parent" },
      { text: "Template URL", align: "start", sortable: false, value: "template_uri" },
      { text: "Level", value: "level" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    entries: [],
    modal: false,
    deleteModal: false,
    response: {},
    rows: ["10", "20", "50", "100"],
    modalTitle: "",
    levels: [],
    exportFormat: "",
    formats: ["pdf", "xlsx", "pptx", "docx", "csv"],
  });

  const loadLocationChildren = (location: any) => {
    store.dispatch("Drawer/CLOSE");
    data.currentItem = data.currentItem === location ? null : location;
    console.log("location", location);
    data.location = location;
    getReportTree(location);
    if (!location.children) {
      if (location.id !== data.node.id) {
        getChildren(location.id).then((response: AxiosResponse) => {
          if (response.data.data.children.length) {
            set(location, "children", response.data.data.children);
          }
        });
      }
    }
  };

  const loadReportCategories = (report: any) => {
    const locationId = data.location["id"];
    data.selectedReport = report;
    if (locationId && reportHasTemplateUrl(report)) {
      router
        .push({
          path: `/reports/${locationId}`,
          query: { report_id: report.id },
        })
        .catch((err) => console.log(err));
    } else {
      data.isInfoDialogOpen = true;
      data.infoMessage = "Sorry, you can only view reports for lower level reports that have a template";
    }
  };

  const getLocationTree = () => {
    fetchLocationTree({}).then((response: AxiosResponse) => {
      console.log("response: ", response.data.data);
      data.location = response.data.data;
    });
  };

  const getNodes = (id?: number | string) => {
    getChildren(id).then((response: AxiosResponse) => {
      data.node = response.data.data;
    });
  };

  const setQueryParams = (location) => {
    if (location.level_id === 5) {
      data.requestParams.location_id = location.id;
      data.requestParams.facility_id = location.id;
    } else {
      data.requestParams.location_id = location.id;
    }
  };

  const getReportTree = (location: any) => {
    setQueryParams(location);
    fetchReportTree(data.requestParams).then((response: AxiosResponse) => {
      data.report = response.data.data;
    });
  };

  const showContextMenu = (node) => {
    console.log("right-clicked node", node);
  };

  const getReportsByLevel = (location) => {
    console.log("reports by level", location);
  };

  const reportHasTemplateUrl = (report) => {
    return report.template_uri ? true : false;
  };

  const closeInfoDialog = (status: boolean) => {
    data.isInfoDialogOpen = !status;
  };

  onMounted(() => {
    if (actionType) {
      fetchReports();
    } else {
      getNodes();
    }
  });

  const fetchReports = () => {
    getReports({}).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
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
    loadLevels();
  };

  const cancelDialog = () => {
    data.modal = false;
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

  const deleteItem = (item: number | string) => {
    const payload = item;
    deleteReport(payload).then(() => {
      if (response.status === 200) {
        fetchReports();
        data.item = {} as User;
        data.isOpen = false;
      }
    });
  };

  const getData = () => {
    fetchReports();
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

  const cancelConfirmDialog = () => {
    data.deleteModal = false;
  };

  const remove = () => {
    deleteReport(data.item).then(() => {
      fetchReports();
      data.deleteModal = false;
    });
    data.item = {};
  };

  const loadLevels = () => {
    getLevels({}).then((response: AxiosResponse) => {
      data.levels = response.data.data.data;
    });
  };

  const printReport = () => {
    console.log("print report");
  };

  return {
    data,
    loadLocationChildren,
    loadReportCategories,
    getLocationTree,
    getReportTree,
    showContextMenu,
    getReportsByLevel,
    reportHasTemplateUrl,
    closeInfoDialog,
    getNodes,
    openDialog,
    updateReport,
    createReport,
    openConfirmDialog,
    closeConfirmDialog,
    deleteItem,
    getData,
    cancelDialog,
    save,
    cancelConfirmDialog,
    remove,
    fetchReports,
    printReport,
  };
};
