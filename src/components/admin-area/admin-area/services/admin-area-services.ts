import axios, { AxiosResponse } from "axios";
const API = "/api/v1/admin-areas";

const get = async (payload: any) => {
  return await axios.get(`${API}`, { params: payload });
};

const find = async (id: string | number) => {
  return await axios.get(`${API}/${id}`);
};

const createArea = async (payload: any) => {
  return await axios.post(`${API}`, payload);
};
const createAreaFromPlanrep = async () => {
  return await axios.post(`${API}`);
};

const updateArea = async (payload: any) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};

const deleteArea = async (id: any) => {
  return await axios.delete(`${API}/${id}`);
};

const getChildren = async (id?: number | string): Promise<AxiosResponse> => {
  if (id) {
    return await axios.get(`${API}-children/${id}`);
  } else {
    return await axios.get(`${API}-children`);
  }
};

export {
  get,
  find,
  createArea,
  updateArea,
  deleteArea,
  getChildren,
  createAreaFromPlanrep,
};
