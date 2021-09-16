import axios from "axios";
const get = async (payload: any) => {
  return await axios.get("/api/v1/bank-accounts", payload);
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/bank-accounts/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/bank-accounts/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/bank-accounts`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/bank-accounts/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/bank-accounts/` + payload);
};

export { get, find, create, update, destroy, search };
