import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/fund-types", payload);
};
const fundingtypes = async () => {
  return await axios.get("/api/v1/fund-types");
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/fund-types/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/fund-types/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/fund-types`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/fund-types/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/fund-types/` + payload);
};

export { get, find, create, update, destroy, search, fundingtypes };
