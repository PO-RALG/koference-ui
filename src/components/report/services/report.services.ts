import axios from "axios";
import { getCurrentUser } from "@/middleware";

const REPORTSERVERUSER = import.meta.env.VITE_APP_REPORT_USER_NAME;
const REPORTSERVERPASSWORD = import.meta.env.VITE_APP_REPORT_PASSWORD;
const APIREPORTPARAMS = "/api/v1/reports";
const API = "/api/v1/reports";
const REPORTSERVER = import.meta.env.VITE_APP_REPORT_SERVER_URL;
const APINEWREPORT = "jasperserver/rest_v2";

const getReports = async (payload) => {
  return axios.get(API, { params: payload });
};

const findReport = async (id) => {
  if (id) return axios.get(`${API}/${id}`);
};

const getParams = async (id) => {
  return axios.get(`${APIREPORTPARAMS}/${id}/parameters`);
};

const serializeParams = (params: any) => {
  const str = [];
  for (const p in params) {
    if (p in params) {
      if (params[p]) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
      }
    }
  }
  return str.join("&");
};

const printReportJasper = async (reportName: any, payload?: any) => {
  console.log("gervas", payload);

  const dataz: any = await axios.get(
    `/${APINEWREPORT}/reports/facility/${reportName}.${payload.format}?facility_id=${payload.facility_id}`,
    {
      params: payload,
      responseType: "stream",
      auth: {
        username: "jasperadmin",
        password: "jasperIsPrintingReports",
      },
    }
  );
  window.open("data:application/pdf," + encodeURI(dataz));
  // .then((response) => {
  //   console.log("ressssss", response);
  // });
  // window.open("data:application/pdf," + encodeURI(res));
};

const printReport = async (reportID: number, payload?: any) => {
  const currentUser = await getCurrentUser();
  const token = currentUser.token;
  const query = serializeParams(payload);

  const url = `${API}/${reportID}/print?${query}&token=${token}`;

  return window.open(url);
};

const createReport = async (payload) => {
  return await axios.post(API, payload);
};

const updateReport = async (payload) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};

const deleteReport = async (payload) => {
  return await axios.delete(API + "/" + payload);
};

const fetchReportTree = async ({ location_id, facility_id }) => {
  if (facility_id) {
    return await axios.get(
      `${API}/by-location?location_id=${location_id}&facility_id=${facility_id}`
    );
  } else {
    return await axios.get(`${API}/by-location?location_id=${location_id}`);
  }
};

const fetchReportParams = async (id) => {
  const END_POINT = `${APIREPORTPARAMS}/${id}/parameters`;
  return axios.get(END_POINT);
};

const updateQuery = async (payload) => {
  return await axios.put(`${API}/${payload.id}/write-query`, payload);
};
const allreportFilters = async (payload) => {
  return await axios.get(`${API}/1/report-filters`, payload);
};

export {
  getReports,
  fetchReportTree,
  findReport,
  createReport,
  updateReport,
  deleteReport,
  fetchReportParams,
  getParams,
  printReport,
  printReportJasper,
  updateQuery,
  allreportFilters,
};
