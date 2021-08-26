import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/gfs-codes", payload);
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/gfs-codes/${id}`);
};

export { get, find };
