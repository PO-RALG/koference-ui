import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/gfs-categories", payload);
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/gfs-categories/${id}`);
};
export { get, find };
