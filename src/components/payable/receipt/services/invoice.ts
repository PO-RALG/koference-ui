import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/receipts", {
    params: payload,
  });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/receipts/`, {
    params: {
      search: JSON.stringify(payload),
      pending: true,
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/receipts/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/receipts`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/receipts/` + payload.id, payload);
};

const viewinvoice = async (payload: any) => {
  return await axios.get(`/api/v1/receipts/` + payload.id, payload);
};

const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/receipts/` + payload);
};

const receiptcreate = async (payload: any) => {
  console.log("payload", payload);
};

const printReceipt = (id: string | number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  let url = `${process.env.VUE_APP_SERVER_URL}/api/v1/receipts/${id}?token=${user.token}`;
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
  printReceipt,
};
