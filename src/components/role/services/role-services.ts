import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/auth-roles", { params: payload });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/auth-roles/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/auth-roles`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/auth-roles/${payload.id}`, payload);
};

const deleteRole = async (id: number | string) => {
  return await axios.put(`/api/v1/auth-roles/${id}`);
};

export { get, find, create, update, deleteRole };
