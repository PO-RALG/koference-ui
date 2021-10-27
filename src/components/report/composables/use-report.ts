import { reactive, onMounted, set, computed } from "@vue/composition-api";
import router from "@/router";

import { fetchReportTree } from "../services/report.services";
import {
  get as fetchLocationTree,
  getChildren,
} from "@/components/admin-area/admin-area/services/admin-area-services";

import { AxiosResponse } from "axios";
import { useRoute } from "vue2-helpers/vue-router";

export const useReport = (): any => {
  const route = useRoute();

  const data = reactive({
    location: {},
    infoMessage: "",
    isInfoDialogOpen: false,
    reportSelected: false,
    reports: [],
    selectedLocation: {},
    item: {},
    selectedReport: {},
    currentItem: null,
    node: null,
  });

  const loadLocationChildren = (location: any) => {
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

  const loadReportCategories = (report) => {
    const locationId = data.selectedLocation.id;
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

  const getReportTree = (location) => {
    fetchReportTree(location.id).then((response: AxiosResponse) => {
      console.log("reports:", response.data.data);
      data.reports = response.data.data;
    });
  };

  const showContextMenu = (node) => {
    console.log("right-clicked node", node);
  };

  const getReportsByLevel = (location) => {
    console.log("reports by level", location);
  };

  const reportHasTemplateUrl = (report) => {
    return report.templateUri ? true : false;
  };

  const closeInfoDialog = (status: boolean) => {
    data.isInfoDialogOpen = !status;
  };

  onMounted(() => {
    const queryParams = router.currentRoute;
    getNodes();
    if (queryParams.query.report_id) {
      fetchReportTree(queryParams.params.id).then((response: AxiosResponse) => {
        data.reports = response.data.data;
      });
    }
  });

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
  };
};
