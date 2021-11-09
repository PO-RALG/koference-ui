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
  return await axios.post(
    `/api/v1/receipts/` + payload.invoice_id + "/invoice",
    payload
  );
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
