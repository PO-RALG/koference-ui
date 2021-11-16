import axios from "axios";

const API = "/api/v1/receipts";

const get = async (payload: any) => {
  return await axios.get(`${API}`, {
    params: payload,
  });
};

const search = async (payload: any) => {
  return await axios.get(`${API}`, {
    params: {
      search: JSON.stringify(payload),
      pending: true,
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`${API}/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`${API}`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};

const viewinvoice = async (payload: any) => {
  return await axios.get(`${API}/${payload.id}`, payload);
};

const destroy = async (payload: any) => {
  return await axios.delete(`${API}/${payload}`);
};

const printReceipt = (id: string | number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  const url = `${process.env.VUE_APP_SERVER_URL}/api/v1/receipts/${id}?token=${user.token}`;
  return window.open(url);
};

export { get, find, create, update, destroy, search, viewinvoice, printReceipt };
