import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/projects", { params: payload });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/projects/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/projects/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/projects`, payload);
};
const activation = async (payload: any) => {
  return await axios.post(`/api/v1/set-financial-year/` + payload.id, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/projects/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/projects/` + payload);
};

export { get, find, create, update, destroy, activation, search };
