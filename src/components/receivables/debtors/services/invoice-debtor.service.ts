import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/invoices/debtors", { params: payload });
};

const search = async (payload: any) => {
  return await axios.post(`/api/v1/invoices/debtors`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/invoices/debtors/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/invoices/debtors`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/invoices/debtors/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/invoices/debtors/` + payload);
};

export { get, find, create, update, destroy, search };
