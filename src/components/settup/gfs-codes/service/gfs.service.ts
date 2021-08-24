import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/gfs-codes", payload);
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/gfs-codes/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/gfs-codes`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/gfs-codes`, payload);
};

export { get, find, create, update };
