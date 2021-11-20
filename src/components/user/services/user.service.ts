import axios from "axios";

const API = "/api/v1/users";

const wait = (ms: number, value) => {
  return new Promise((resolve) => setTimeout(resolve, ms, value));
};

const get = async (payload: any) => {
  return await axios.get(`${API}`, { params: payload });
  //.then(value => wait(5000, value))
};

const find = async (id: string | number) => {
  return await axios.get(`${API}/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`${API}`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};

const deleteUser = async (id: number | string) => {
  return await axios.put(`${API}/${id}`);
};

const toggleActive = async (payload: any) => {
  console.log("payload", payload);
  return await axios.post(`${API}/${payload.id}/change-status`);
};

const resetPassword = async (payload: any) => {
  return await axios.post(`${API}/reset-password`, payload);
};

const addApprovalRoles = async (payload: any) => {
  return await axios.post(`${API}/add-approval-roles`, payload);
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
};
