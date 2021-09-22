import axios from "axios";

const API = "/api/v1/financial-years";

const get = async (payload: any) => {
  return await axios.get(`${API}`, { params: payload });
};

const search = async (payload: any) => {
  return await axios.get(`${API}`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`${API}/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`${API}`, payload);
};

const startFinancialYear = async (payload: any) => {
  return await axios.post(`${API}/${payload.id}/start`);
};

const toggleActive = async (payload: any) => {
  return await axios.post(`${API}/${payload.id}/toggle`);
};

const update = async (payload: any) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};

const destroy = async (id: string | number) => {
  return await axios.delete(`${API}/${id}`);
};

export {
  get,
  find,
  create,
  update,
  destroy,
  startFinancialYear,
  search,
  toggleActive,
};
