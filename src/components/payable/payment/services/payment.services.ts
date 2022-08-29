import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/payments", { params });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/payments/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/payments/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/payments`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/payments/` + payload.id, payload);
};

const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/payments/${payload.id}`, {
    data: { date: payload.date },
  });
};

const printPdf = (id: number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  const url = `https://ffars.tamisemi.go.tz/api/v1/payments/${id}/print?token=${user.token}`;
  // const url = `${process.env.VUE_APP_SERVER_URL}/api/v1/payments/${id}/print?token=${user.token}`;
  return window.open(url);
};

export { get, find, create, update, destroy, search, printPdf };
