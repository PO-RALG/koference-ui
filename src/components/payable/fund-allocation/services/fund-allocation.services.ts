import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/fund-allocations",  {params});
};

const getBudget = async (params: any) => {
  return await axios.get("/api/v1/filter-budgets",  {params});
};

const statistic = async (id: any) => {
  return await axios.get(`/api/v1/funds/${id}/statistics`);
};

const search = async (payload: any) => {
  return await axios.get(`/api/v1/fund-allocations/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/fund-allocations/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/allocation-groups`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/fund-allocations/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/fund-allocations/` + payload);
};

export { get, find, create, update, destroy, search, getBudget, statistic };
