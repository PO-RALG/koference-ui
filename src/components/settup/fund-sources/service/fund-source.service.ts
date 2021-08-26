import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v2/users", payload);
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v2/users/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v2/users`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v2/users`, payload);
};

export { get, find, create, update };
