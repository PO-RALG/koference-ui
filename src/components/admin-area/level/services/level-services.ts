import axios from "axios";
const API = "/api/v1/admin-area-levels";

const get = async (payload: any) => {
  return await axios.get(`${API}`, { params: payload });
};

const find = async (id: string | number) => {
  return await axios.get(`${API}/${id}`);
};

const createLevel = async (payload: any) => {
  return await axios.post(`${API}`, payload);
};

const updateLevel = async (payload: any) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};

const deleteLevel = async (id: any) => {
  return await axios.delete(`${API}/${id}`);
};

export { get, find, createLevel, updateLevel, deleteLevel };
