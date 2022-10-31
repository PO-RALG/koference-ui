import axios from "axios";
import { getCurrentUser } from "@/middleware";

const API = "/api/v1/reports";
const API2 = "localhost:8000/api/v1/reports";
const APINEWREPORT =
  "https://ffars.tamisemi.go.tz/jasperserver/rest_v2/reports/Reports/journal_voucher.pdf?journal_voucher_id=17";

const getReports = async (payload) => {
  return axios.get(API, { params: payload });
};

const findReport = async (id) => {
  if (id) return axios.get(`${API}/${id}`);
};

const getParams = async (id) => {
  return axios.get(`${API}/${id}/parameters`);
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

const printReportJasper = async () => {
  const params = {
    paramEmail: "",
  };

  const file = await axios
    .get(APINEWREPORT, {
      params: params,
      responseType: "stream",
      auth: {
        username: "jasperadmin",
        password: "jasperIsPrintingReports",
      },
    })
    .then(function (response) {
      console.log(response.data);
    });
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
  const END_POINT = `${API}/${id}/parameters`;
  return axios.get(END_POINT);
};

const updateQuery = async (payload) => {
  return await axios.put(`${API}/${payload.id}/write-query`, payload);
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
};
