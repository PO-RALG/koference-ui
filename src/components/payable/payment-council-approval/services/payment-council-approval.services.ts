import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/payment_reversal/approval-pending-council", {
    params,
  });
};
const getVouchers = async (params: any) => {
  return await axios.get("/api/v1/vouchers", { params });
};

const approveReversalPCouncilService = async (payload: any) => {
  return await axios.post(`/api/v1/payment_reversal/approval-council`, payload);
};

const search = async (payload: any) => {
  return await axios.get(`/api/v1/payment_reversal/approval-pending-council/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/payments/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(
    `/api/v1/payment_reversal/approval-pending-council`,
    payload
  );
};

const update = async (payload: any) => {
  return await axios.put(
    `/api/v1/payment_reversal/approval-pending-council/` + payload.id,
    payload
  );
};

const destroy = async (payload: any) => {
  return await axios.delete(
    `/api/v1/payment_reversal/approval-pending-council/${payload.id}`,
    {
      data: { date: payload.date },
    }
  );
};

const printPdf = (id: number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  const url2 = `${
    import.meta.env.VITE_APP_SERVER_URL
  }/api/v1/payments/${id}/print?token=${user.token}`;
  const url = `/api/v1/payments/${id}/print?token=${user.token}`;
  return window.open(url2);
};

export {
  get,
  find,
  create,
  approveReversalPCouncilService,
  update,
  destroy,
  search,
  printPdf,
  getVouchers,
};
