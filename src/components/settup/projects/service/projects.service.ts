import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/projects", payload);
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/projects/${id}`);
};
export { get, find };
