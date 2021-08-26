import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/users", payload);
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/users/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/users`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/users/${payload.id}`, payload);
};

const deleteUser = async (id: number | string) => {
  return await axios.put(`/api/v1/users/${id}`);
};

export { get, find, create, update, deleteUser };
