import { reactive, watch, computed, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import { useRoute } from "vue2-helpers/vue-router";
import router from "@/router";
import startCase from "lodash/startCase";

import { findReport, fetchReportParams, printReport } from "../services/report.services";
import { find } from "@/components/admin-area/admin-area/services/admin-area-services";

export const useReportDetail = (props, { root }) => {
  const route = useRoute();

  const API_MAP = [
    { name: "FUNDING_SOURCE", api: "api/v1/funding-sources" },
    { name: "FINANCIAL_YEAR", api: "api/v1/financial-years" },
    { name: "FACILITY", api: "api/v1/facilities" },
    { name: "FACILITY_TYPE", api: "api/v1/facility-types" },
    { name: "LOCATION", api: "api/v1/admin-areas" },
    { name: "GFS_CODE", api: "api/v1/gfs-codes" },
    { name: "END_GFS", api: "api/v1/gfs-codes" },
    { name: "START_GFS", api: "api/v1/gfs-codes" },
    { name: "GL_ACCOUNT", api: "api/v1/gl-accounts" },
    { name: "BANK_ACCOUNT", api: "api/v1/bank-accounts" },
  ];

  const data = reactive({
    valid: true,
    currentReport: null,
    reportParameters: [],
    location: null,
    formData: {
      funding_source_id: null,
      financial_year_id: null,
      facility_id: null,
      facility_type_id: null,
      location_id: router.currentRoute.params.location_id,
      gfs_code_id: null,
      end_gfs_id: null,
      start_gfs_id: null,
      gl_account_id: null,
      bank_account_id: null,
      start_date: null,
      end_date: null,
    },
    format: ["pdf", "xlsx", "pptx", "docx", "csv"],
  });

  onMounted(() => {
    console.log()
    init();
  });

  const init = () => {
    const location_id = root.$route.params.location_id;
    const report_id = root.$route.query.report_id;
    if (report_id) {
      //console.log("report id", report_id);
      find(location_id)
        .then((response: AxiosResponse) => {
          data.location = response.data.data;
        })
        .then(() => {
          findReport(report_id).then((response: AxiosResponse) => {
            data.currentReport = response.data.data;
          });
        })
        .then(() => {
          fetchReportParams(report_id).then((response: AxiosResponse) => {
            data.reportParameters = response.data.data;
          });
        });
    } else {
      // if there is no report_id then just go back to reports
      data.currentReport = null;
      data.location = null;
      router.push({ path: `/reports`, query: {}, params: { location_id } }); // -> /reports/2
    }
  };

  const setApi = (name: string): string => {
    const nameArray = name.split("_");
    nameArray.pop();
    const result = nameArray.join("_").replace(/\s/g, "").toUpperCase();
    const requiresAPI = requireApiCall(name);
    const API = requiresAPI ? API_MAP.find((api: any) => api.name === result).api : null;
    return API ? API : null;
  };

  const setDescription = (name: string): string => {
    if (name.endsWith("id")) {
      const nameArray = name.split("_");
      const res = nameArray.pop();
      const result = nameArray.join(" ");
      return `Select ${startCase(result)}`;
    } else {
      const result = name.split("_").join(" ");
      return `${startCase(result)}`;
    }
  };

  const setKey = (name: string): string => {
    const nameArray = name.split("_");
    nameArray.pop();
    const result = nameArray.join("_").replace(/\s/g, "").toUpperCase();
    return result;
  };

  const setType = (name: string): string => {
    switch (name.endsWith("id")) {
      case true:
        return "BaseSelect";
      default:
        return "DatePicker";
    }
  };

  const requireApiCall = (name: string): boolean => {
    switch (name.endsWith("id")) {
      case true:
        return true;
      default:
        return false;
    }
  };

  const reportParams = computed(() => {
    return (
      data.reportParameters
        .filter((p: any) => p.name !== "source_path")
        .filter((p: any) => p.name !== "location_id")
        //.filter((p: any) => p.required === 1)
        .map((param: any, idx: number) => ({
          ...param,
          id: idx + 1,
          componentType: setType(param.name),
          isRequired: param.required === 0 ? false : true,
          needsApiCall: requireApiCall(param.name),
          key: setKey(param.name),
          description: setDescription(param.name),
          api: setApi(param.name),
        }))
    );
  });

  watch(() => root.$route.query.report_id, async (newReportID) => {
      console.log("report id", newReportID);
      if (newReportID) {
        findReport(newReportID).then((response: AxiosResponse) => {
          data.currentReport = response.data.data;
        });
      } else {
        data.currentReport = null;
      }
    }
  );

  const print = () => {
    printReport(data.currentReport.id, data.formData);
  };

  return {
    data,
    print,
    reportParams,
  };
};