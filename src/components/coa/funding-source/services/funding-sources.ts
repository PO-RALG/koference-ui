import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/funding-sources", { params: payload });
};

const fundingsources = async (payload: any) => {
  return await axios.get("/api/v1/funding-sources", { params: payload });
};

const search = async (payload: any) => {
  return await axios.get(`/api/v1/funding-sources/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/funding-sources/${id}`);
};

const fetchSegments = async (payload: any) => {
  return await axios.post(`/api/v1/funding-sources`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/funding-sources/` + payload.id, payload);
};

const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/funding-sources/` + payload);
};

const create = async () => {
  return await axios.post(`/api/v1/funding-sources`);
};

export {
  get,
  find,
  create,
  update,
  destroy,
  fundingsources,
  search,
  fetchSegments,
};
