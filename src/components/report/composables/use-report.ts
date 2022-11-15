import { computed, onMounted, reactive, set, watch } from "vue";
import { fetchReportTree } from "../services/report.services";
import router from "@/router";
import store from "@/store";
import { getCurrentUser } from "@/middleware";

import {
  find,
  get as fetchLocationTree,
  getChildren,
} from "@/components/admin-area/admin-area/services/admin-area-services";
import { AxiosResponse } from "axios";
import { useRoute } from "@/helpers/RouterHelper";

export const useReport = (props, { root }): any => {
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
    selectedReport: null,
    currentItem: null,
    report: null,
    node: null,
    deleteModal: false,
    modalTitle: "",
  });

  const loadLocationChildren = async (location: any) => {
    // if data.location.id is similar to the selected location.id
    // dont do any navigation otherwise replace the params

    store.dispatch("Drawer/CLOSE");
    await loadReportsByLocation(location);
    data.currentItem = data.currentItem === location ? null : location;
    data.location = location;
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
    data.selectedReport = report;
    const locationId = data.location.id;
    if (locationId && !report.children) {
      const path = `/reports/${locationId}?report_id=${report.id}`;
      const currentPath = route.path;
      if (currentPath === path) {
        return;
      } else {
        router.push(path).catch((err) => console.log(err));
      }
    } else {
      if (!report.children) {
        data.isInfoDialogOpen = true;
        data.infoMessage =
          "Sorry, you can only view reports that have a template";
      }
      if (route.path === "/reports") {
        return;
      } else {
        router.push({ path: "/reports" });
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

  const locationId = computed(() => parseInt(route.params.location_id));

  const hasTemplateUrL = computed(() => {
    return reportHasTemplateUrl(data.selectedReport);
  });

  const getNodes = async (id?: number | string) => {
    find(id)
      .then((response: AxiosResponse) => {
        loadReportsByLocation(response.data.data);
        data.location = response.data.data;
        data.currentItem = response.data.data;
      })
      .then(() => {
        getChildren(id).then((response: AxiosResponse) => {
          data.node = response.data.data;
        });
      });
  };

  const reportHasTemplateUrl = (report: any) => {
    return report.template_uri ? true : false;
  };

  const closeInfoDialog = (status: boolean) => {
    data.isInfoDialogOpen = !status;
  };

  onMounted(() => {
    const locationId = route.params.location_id;
    // if there's no location id param then
    // add the current user's location_id in the param
    // if there's location don't do anything just load the report categories
    if (locationId) {
      getNodes(locationId);
    } else {
      getNodes(currentUser.location_id);
    }
  });

  return {
    data,
    loadLocationChildren,
    loadReportCategories,
    getLocationTree,
    reportHasTemplateUrl,
    closeInfoDialog,
    getNodes,
    location,
    hasTemplateUrL,
    locationId,
  };
};
