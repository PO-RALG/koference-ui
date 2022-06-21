import axios from "axios";
const API = "/api/v1/approval-roles";

const get = async (payload: any) => {
  return await axios.get(`${API}`, { params: payload });
};

const create = async (payload: any) => {
  return await axios.post(`${API}`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};

const deleteRole = async (id: number | string) => {
  return await axios.put(`${API}/${id}`);
};

export { get, create, update, deleteRole };
