import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v2/gfsCodes", payload);
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v2/gfsCodes/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v2/gfsCodes`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v2/gfsCodes`, payload);
};

export { get, find, create, update };
