import axios from "axios";
const API = "/api/v1/roles";
const PERMISSION_API = "/api/v1/auth-permissions";

const get = async (payload: any) => {
  return await axios.get(`${API}`, { params: payload });
};

const getPermissions = async (payload: any) => {
  return await axios.get(`${PERMISSION_API}`, { params: payload });
};

const addPermissions = async (payload: any) => {
  return await axios.post(`${API}/add-permissions`, payload);
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

const deleteRole = async (id: number | string) => {
  return await axios.delete(`${API}/${id}`);
};

export {
  get,
  find,
  create,
  update,
  deleteRole,
  getPermissions,
  addPermissions,
};
