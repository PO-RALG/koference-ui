import axios, { AxiosResponse } from "axios";

const STALE_CHECK_API = "/api/v1/stale-cheques";

const get = async (params: any) => {
  return await axios.get("/api/v1/payments", { params });
};

const getVouchers = async (params: any) => {
  return await axios.get("/api/v1/vouchers", { params });
};

const approveReversalPFacilityService = async (payload: any) => {
  return await axios.post(`/api/v1/payment_reversal/approval`, payload);
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
  // const url = `${
  //   import.meta.env.VITE_APP_SERVER_URL
  // }/api/v1/payments/${id}/print?token=${user.token}`;
  const url = `/api/v1/payments/${id}/print?token=${user.token}`;
  return window.open(url);
};

const stalePayment = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${STALE_CHECK_API}`, payload);
}

export {
  approveReversalPFacilityService,
  create,
  destroy,
  find,
  get,
  getVouchers,
  printPdf,
  search,
  update,
stalePayment,
};
