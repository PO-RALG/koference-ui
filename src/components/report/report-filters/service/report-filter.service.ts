import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/report-filter", { params: payload });
};

const search = async (payload: any) => {
  return await axios.get(`/api/v1/report-filter/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/report-filter/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/report-filter`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/report-filter/` + payload.id, payload);
};

const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/report-filter/` + payload);
};

export { get, find, create, update, destroy, search };
