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

const activation = async (payload: any) => {
  return await axios.post(
    `/api/v1/invoices/` + payload.id + "/change-status",
    payload
  );
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
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/invoices/` + payload);
};

export { get, find, create, update, destroy, search, activation };
