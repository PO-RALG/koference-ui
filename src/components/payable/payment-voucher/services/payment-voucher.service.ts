import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/vouchers",  {params});
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/vouchers/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/vouchers/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/vouchers`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/vouchers/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/vouchers/` + payload);
};

export { get, find, create, update, destroy, search };
