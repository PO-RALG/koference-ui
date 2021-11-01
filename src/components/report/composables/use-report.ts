import { reactive, onMounted, set, computed, watch } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";

import {
  fetchReportTree,
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getParams,
} from "../services/report.services";
import {
  get as fetchLocationTree,
  getChildren,
  find,
} from "@/components/admin-area/admin-area/services/admin-area-services";
import { get as getLevels } from "@/components/admin-area/level/services/level-services";

import { AxiosResponse } from "axios";
import { useRoute } from "vue2-helpers/vue-router";
import { getCurrentUser } from "@/middleware";

export const useReport = (actionType?: string): any => {
  const route = useRoute();
  const currentUser = getCurrentUser();

  const data = reactive({
    location: null,
    locationID: null,
    reportIcon: "mdi-attachment",
    locations: [],
    reportParams: null,
    infoMessage: "",
    isInfoDialogOpen: false,
    reportSelected: false,
    isOpen: false,
    requestParams: {
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
    params: {
      asc: "order",
      from: null,
      to: null,
      total: null,
      current_page: null,
      per_page: null,
      last_page: null,
    },
    rows: ["10", "20", "50", "100"],
    modalTitle: "",
    levels: [],
    exportFormat: "",
    formats: ["pdf", "xlsx", "pptx", "docx", "csv"],
  });

  const loadLocationChildren = (location: any) => {
    data.location = location;
    data.currentItem = data.currentItem === location ? null : location;
    data.locationID = location.id;
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
    store.dispatch("Drawer/CLOSE");
  };

  const getReportParameters = async (id: number) => {
    getParams(id).then((response: AxiosResponse) => {
      data.reportParams = response.data.data;
    });
  };

  const loadReportCategories = async (report: any) => {
    const locationId = data.location["id"];
    data.selectedReport = report;
    if (locationId && reportHasTemplateUrl(report)) {
      await getReportParameters(report.id);
      router
        .push({
          path: `/reports/${locationId}`,
          query: { report_id: report.id },
        })
        .catch((err) => console.log(err));
    } else {
      const reportId = router.currentRoute.query.report_id;
      console.log("not reportable");
      if (reportId) {
        router.go(-1);
      }
    }
  };

  watch(
    () => route.params.location_id,
    async (newLocationID: number | string) => {
      find(newLocationID).then((response: AxiosResponse) => {
        data.location = response.data.data;
        data.currentItem = response.data.data;
      });
    }
  );

  const getLocationTree = () => {
    fetchLocationTree({}).then((response: AxiosResponse) => {
      data.location = response.data.data;
    });
  };

  const location = computed(() => {
    return data.location;
  });

  const getNodes = async (id?: number | string) => {
    const locationID = router.currentRoute.params.location_id;
    let location = null;
    if (locationID && !data.location) {
      find(locationID)
        .then((response: AxiosResponse) => {
          location = response.data.data;
          data.location = response.data.data;
          data.currentItem = response.data.data;
        })
        .then(() => {
          getChildren(id)
            .then((response: AxiosResponse) => {
              data.node = response.data.data;
            })
            .then(() => {
              getReportTree(location);
              setQueryParams(location);
            });
        });
    } else {
      getChildren(id).then((response: AxiosResponse) => {
        data.node = response.data.data;
      });
    }
  };

  const setQueryParams = async (location: any) => {
    router
      .push({
        path: `/reports/${location.id}`,
      })
      .catch((error: any) => {
        console.error(error);
      });

    if (location.level_id === 5) {
      data.requestParams.location_id = location.id;
      data.requestParams.facility_id = location.id;
    } else {
      data.requestParams.location_id = location.id;
    }
  };

  const getReportTree = async (location: any) => {
    await setQueryParams(location);
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
    getReports({ per_page: 100, asc: "order" }).then((response: AxiosResponse) => {
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
    loadLevels();
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
    loadReports,
    printReport,
    location,
  };
};
