import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/invoices", {
    params: payload,
  });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/invoices/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/invoices/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/invoices`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/invoices/` + payload.id, payload);
};

const viewinvoice = async (payload: any) => {
  return await axios.get(`/api/v1/invoices/` + payload.id, payload);
};

const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/invoices/` + payload);
};

const receiptcreate = async (payload: any) => {
  console.log("payload", payload);
  return await axios.post(`/api/v1/receipts/` + 27 + "/invoice", payload);
};
export {
  get,
  find,
  create,
  update,
  destroy,
  search,
  viewinvoice,
  receiptcreate,
};
