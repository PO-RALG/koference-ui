import axios from "axios";

const API = "/api/v1/users";
const MAPROLES = "/api/v1/user-roles";
const APIUSERQUERY = "/api/v1/user-queries";
const APIALL = "/api/v1/users/users/search";
const APISENDMAIL = "/api/v1/users/sendMail";
const APISENDSUBMISSIONMAIL = "/api/v1/users/sendSubmissionMail";

const wait = (ms: number, value) => {
  return new Promise((resolve) => setTimeout(resolve, ms, value));
};

const get = async (payload: any) => {
  return await axios.get(`${API}`, { params: payload });
  //.then(value => wait(5000, value))
};

const find = async (payload: any) => {
  console.log("data", payload);
  return await axios.get(`${APIALL}`, { params: payload });
};

const create = async (payload: any) => {
  return await axios.post(`${API}`, payload);
};
const maprole = async (payload: any) => {
  return await axios.post(`${MAPROLES}`, payload);
};

const sendMail = async (payload: any) => {
  return await axios.post(`${APISENDMAIL}`, payload);
};
const sendMailForSubmition = async (payload: any) => {
  return await axios.post(`${APISENDSUBMISSIONMAIL}`, payload);
};

const saveUserQuety = async (payload: any) => {
  return await axios.post(`${APIUSERQUERY}`, payload);
};

const update = async (payload: any) => {
  return await axios.patch(`${API}/${payload.id}`, payload);
};

const deleteUser = async (id: number | string) => {
  return await axios.delete(`${API}/${id}`);
};

const toggleActive = async (payload: any) => {
  console.log("payload", payload);
  return await axios.patch(`${API}/${payload.id}/change-status`);
};

const resetPassword = async (payload: any) => {
  return await axios.post(`${API}/reset-password`, payload);
};

const addApprovalRoles = async (payload: any) => {
  return await axios.put(`${API}/add-approval-roles/${payload.id}`, payload);
};

const getTrushed = async (payload: any) => {
  return await axios.get("/api/v1/users/trushed", { params: payload });
};

const restoreUser = async (payload: any) => {
  // console.log("payload", payload);
  return await axios.put(
    `/api/v1/users/restore/` + payload.id + "/trashed-user",
    payload
  );
};

export {
  get,
  find,
  create,
  update,
  deleteUser,
  toggleActive,
  resetPassword,
  addApprovalRoles,
  getTrushed,
  restoreUser,
  saveUserQuety,
  sendMail,
  sendMailForSubmition,
  maprole,
};
