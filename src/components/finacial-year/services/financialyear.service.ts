import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/financial-years", payload);
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/financial-years/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/financial-years`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/financial-years`, payload);
};

export { get, find, create, update };
