import axios from "axios";

const API = "api/v1/reports";
const ENDPOINT = "api/v1/reportp/exportz";

const getReports = async (payload) => {
  return axios.get(API, { params: payload });
};

const findReport = async (id) => {
  return axios.get(`${API}/${id}`);
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
  return await axios.put(API, payload);
};

const deleteReport = async (payload) => {
  return await axios.delete(API + "/" + payload);
};

const fetchReportTree = async (payload) => {
  const END_POINT = `${api}/${payload}/tree`;
  return await axios.get(END_POINT);
};

const fetchReportTree2 = async (payload) => {
  const params = {
    "levelId.equals": payload,
  };
  return axios.get(API, { params: params });
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
  fetchReportTree2,
};
