import { computed, onMounted, reactive, watch } from "vue";
import { AxiosResponse } from "axios";
import router from "@/router";
import startCase from "lodash/startCase";

import {
  fetchReportParams,
  findReport,
  printReport,
  printReportJasperExcell,
  printReportJasper,
} from "../services/report.services";
import { find } from "@/components/admin-area/admin-area/services/admin-area-services";
import { useRoute } from "@/helpers/RouterHelper";

export const useReportDetail = (props, { root }) => {
  const route = useRoute();

  const API_MAP = [
    { name: "FUND_SOURCE", api: "api/v1/funding-sources" },
    { name: "FUND_TYPE", api: "api/v1/fund-types" },
    { name: "FINANCIAL_YEAR", api: "api/v1/financial-years" },
    { name: "FACILITY", api: "api/v1/facilities" },
    { name: "FACILITY_TYPE", api: "api/v1/facility-types" },
    { name: "LOCATION", api: "api/v1/admin-areas" },
    { name: "GFS_CODE", api: "api/v1/gfs-codes" },
    { name: "END_GFS", api: "api/v1/gfs-codes" },
    { name: "START_GFS", api: "api/v1/gfs-codes" },
    { name: "GL_ACCOUNT", api: "api/v1/gl-accounts" },
    { name: "BANK_ACCOUNT", api: "api/v1/bank-accounts" },
    { name: "JOURNAL_VOUCHER", api: "api/v1/journal-vouchers" },
    { name: "SUPPLIER", api: "api/v1/suppliers" },
    { name: "CUSTOMER", api: "api/v1/customers" },
    { name: "GFS_CATEGORY", api: "api/v1/gfs_categories" },
    { name: "IVOICE", api: "api/v1/invoices" },
    { name: "LEVEL", api: "api/v1/levels" },
    { name: "OPENING_BALANCE", api: "api/v1/opening-balances" },
    { name: "PAYMENT", api: "api/v1/payments" },
    { name: "PAYMENT_VOUCHER", api: "api/v1/payment_vouchers" },
    { name: "BANK_RECONSILIATION", api: "api/v1/bank-reconciliation" },
    { name: "SUB_BUDGET_CLASS", api: "api/v1/sub-budget-classes" },
  ];

  const data = reactive({
    location_id: null,
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
      format: null,
    },
    // format: ["pdf", "xlsx", "pptx", "docx", "csv"],
    format: ["pdf", "xlsx"],
    validate: {
      format: [(v) => !!v || " This field is mandatory."],
    },
  });

  onMounted(() => {
    data.location_id = route.params.location_id;
    const user: any = localStorage.getItem("FFARS_USER");
    const userObj = JSON.parse(user);
    if (userObj.facility) {
      data.formData.facility_id = userObj.facility.id;
    }
    console.log();
    init();
  });

  const init = () => {
    const location_id = route.params.location_id;
    const report_id = route.query.report_id;
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
    console.log("results", result);
    const API = requiresAPI
      ? API_MAP.find((api: any) => api.name === result).api
      : null;
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

  const isFacility = computed(() => {
    const user: any = localStorage.getItem("FFARS_USER");
    const userObj = JSON.parse(user);
    return userObj.facility ? true : false;
  });

  const reportParams = computed(() => {
    const user: any = localStorage.getItem("FFARS_USER");
    const userObj = JSON.parse(user);
    if (userObj.facility) {
      return (
        data.reportParameters
          .filter((p: any) => p.name !== "source_path")
          .filter((p: any) => p.name !== "location_id")
          .filter((p: any) => p.name !== "facility_id")
          //.filter((p: any) => p.required === 1)
          .map((param: any, idx: number) => ({
            ...param,
            id: idx + 1,
            componentType: setType(param.name),
            isRequired: param.required === 0 ? false : false,
            needsApiCall: requireApiCall(param.name),
            key: setKey(param.name),
            description: setDescription(param.name),
            api: setApi(param.name),
          }))
      );
    } else {
      return (
        data.reportParameters
          .filter((p: any) => p.name !== "source_path")
          .filter((p: any) => p.name !== "location_id")
          .filter((p: any) => p.name !== "facility_id")
          //.filter((p: any) => p.required === 1)
          .map((param: any, idx: number) => ({
            ...param,
            id: idx + 1,
            componentType: setType(param.name),
            isRequired: param.required === 0 ? false : false,
            needsApiCall: requireApiCall(param.name),
            key: setKey(param.name),
            description: setDescription(param.name),
            api: setApi(param.name),
          }))
      );
    }
  });

  watch(
    () => route.query.report_id,
    async (newReportID) => {
      // console.log("report id", newReportID);
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

  const printFromServer = () => {
    console.log("reportxxx ", data.formData.format);
    if (data.formData.format == "pdf") {
      printReportJasper(data.currentReport.template_uri, data.formData);
    } else {
      printReportJasperExcell(data.currentReport.template_uri, data.formData);
    }
  };

  return {
    data,
    print,
    printFromServer,
    reportParams,
    isFacility,
  };
};
