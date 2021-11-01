import axios from "axios";

const API = "api/v1/reports";
const ENDPOINT = "api/v1/reportp/exportz";

const getReports = async (payload) => {
  return axios.get(API, { params: payload });
};

const findReport = async (id) => {
  return axios.get(`${API}/${id}`);
};

const getParams = async (id) => {
  return axios.get(`${API}/${id}/parameters`);
};

const createReport = async (payload) => {
  return await axios.post(API, payload);
};

const exportReport = async (payload) => {
  return await axios({
    url: ENDPOINT,
    data: payload,
    method: "POST",
    responseType: "blob",
  });
};

const updateReport = async (payload) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};

const deleteReport = async (payload) => {
  return await axios.delete(API + "/" + payload);
};

const fetchReportTree = async ({ location_id, facility_id }) => {
  if (facility_id) {
    return await axios.get(`${API}/by-location?location_id=${location_id}&facility_id=${facility_id}`);
  } else {
    return await axios.get(`${API}/by-location?location_id=${location_id}`);
  }
};

const fetchReportParams = async (payload) => {
  const END_POINT = `${API}/report-parameters/${payload}`;
  return axios.get(END_POINT);
};

export {
  getReports,
  fetchReportTree,
  findReport,
  createReport,
  exportReport,
  updateReport,
  deleteReport,
  fetchReportParams,
  getParams,
};
