import { reactive, onMounted, set, computed } from "@vue/composition-api";
import { fetchReportTree } from "../services/report.services";
import router from "@/router";
import store from "@/store";

import {
  get as fetchLocationTree,
  getChildren,
  find,
} from "@/components/admin-area/admin-area/services/admin-area-services";

import { AxiosResponse } from "axios";
import { useRoute } from "vue2-helpers/vue-router";

export const useReport = (): any => {
  const route = useRoute();

  const data = reactive({
    location: null,
    locationID: null,
    reportIcon: "mdi-attachment",
    locations: [],
    reportParams: null,
    infoMessage: "",
    isInfoDialogOpen: false,
    selectedReport: null,
    currentItem: null,
    report: null,
    node: null,
    deleteModal: false,
    rows: ["10", "20", "50", "100"],
    modalTitle: "",
    formats: ["pdf", "xlsx", "pptx", "docx", "csv"],
  });

  const loadLocationChildren = async (location: any) => {
    data.location = location;
    await loadReportsByLocation(location);
    data.currentItem = data.currentItem === location ? null : location;
    data.locationID = location.id;
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

  const loadReportsByLocation = async (location) => {
    const params = {
      location_id: location.id,
      facility_id: location.level_id === 6 ? location.id : null,
    };

    fetchReportTree(params).then((response: AxiosResponse) => {
      data.report = response.data.data;
    });
  };

  const loadReportCategories = async (report: any) => {
    const locationId = data.location.id;
    if (locationId && reportHasTemplateUrl(report)) {
      router
        .push({
          path: `/reports/${locationId}`,
          query: { report_id: report.id },
        })
        .catch((err) => console.log(err));
    } else {
      const reportId = router.currentRoute.query.report_id;
      if (reportId) {
        router.go(-1);
      }
    }
  };

  const getLocationTree = () => {
    fetchLocationTree({}).then((response: AxiosResponse) => {
      data.location = response.data.data;
    });
  };

  const location = computed(() => {
    return data.location;
  });

  const hasTemplateUrL = computed(() => {
    return reportHasTemplateUrl(data.selectedReport);
  });

  const getNodes = async (id?: number | string) => {
    const locationID = id ? id : route.params.location_id;
    if (locationID && !data.location) {
      find(locationID)
        .then((response: AxiosResponse) => {
          data.location = response.data.data;
          data.currentItem = response.data.data;
        })
        .then(() => {
          getChildren(id)
            .then((response: AxiosResponse) => {
              data.node = response.data.data;
            })
            .then(() => {
              setQueryParams(data.location);
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
  };

  const showContextMenu = (node) => {
    console.log("right-clicked node", node);
  };

  const getReportsByLevel = (location) => {
    console.log("reports by level", location);
  };

  const reportHasTemplateUrl = (report: any) => {
    return report.template_uri ? true : false;
  };

  const closeInfoDialog = (status: boolean) => {
    data.isInfoDialogOpen = !status;
  };

  onMounted(() => {
    if (route.params.location_id) {
      find(route.params.location_id).then((response: AxiosResponse) => {
        data.location = response.data.data;
        loadReportsByLocation(response.data.data);
        getNodes(route.params.location_id);
      });
    } else {
      getNodes();
    }
  });

  return {
    data,
    loadLocationChildren,
    loadReportCategories,
    getLocationTree,
    showContextMenu,
    getReportsByLevel,
    reportHasTemplateUrl,
    closeInfoDialog,
    getNodes,
    location,
    hasTemplateUrL,
  };
};
