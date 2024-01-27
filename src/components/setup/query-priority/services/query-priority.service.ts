import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/query-priority", { params: payload });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/query-priority/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};
const searchCategories = async (payload: any) => {
  return await axios.get(`/api/v1/query-priority/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/query-priority/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/query-priority`, payload);
};

const update = async (payload: any) => {
  return await axios.patch(`/api/v1/query-priority/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/query-priority/` + payload);
};

export { get, find, create, update, destroy, search, searchCategories };
