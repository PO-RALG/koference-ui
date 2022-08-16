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
      pending: true,
    },
  });
};

const regSearch = async (payload: any) => {
  return await axios.get(`/api/v1/invoices/`, { params: payload });
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
  return await axios.post(
    `/api/v1/receipts/` + payload.invoice_id + "/invoice",
    payload
  );
};

const printInvoice = (id: string | number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  const url = `https://ffars.tamisemi.go.tz/api/v1/invoices/${id}?token=${user.token}`;
  // const url = `${process.env.VUE_APP_SERVER_URL}/api/v1/invoices/${id}?token=${user.token}`;
  return window.open(url);
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
  regSearch,
  printInvoice,
};
