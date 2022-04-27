import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/cheque-lists",  {params});
};
const search = async (payload: any) => {
  return await axios.post(`/api/v1/cheque-lists`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/cheque-lists/${id}`);
};

const getPayments = async (data: any) => {
  return await axios.post(`/api/v1/cheque-lists/items`, data);
}

const create = async (payload: any) => {
  return await axios.post(`/api/v1/cheque-lists`, payload);
};

const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/cheque-lists/` + payload);
};

const printPdf = (id: string | number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  const url = `${process.env.VUE_APP_SERVER_URL}/api/v1/cheque-lists/${id}?token=${user.token}`;
  return window.open(url);
}

export { get, find, search, getPayments, create, destroy, printPdf };
