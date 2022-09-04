import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/vouchers", { params });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/vouchers/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/vouchers/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/vouchers`, payload);
};
const approvePVFacility = async (payload: any) => {
  return await axios.post(`/api/v1/payment_voucher/approval`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/vouchers/` + payload.id, payload);
};

const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/vouchers/` + payload);
};

const fundByActivity = async (id: string | number) => {
  return await axios.get(`/api/v1/budgets/${id}/funds`);
};

const fundByActivityFundSource = async (
  activityId: string | number,
  id: string | number
) => {
  return await axios.get(`/api/v1/budgets/${activityId}/${id}/gfs`);
};

const activitiesByFundSource = async (id: number | string) => {
  return await axios.get(`/api/v1/budgets/${id}/get-activities`);
};

const printPdf = (id: string | number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  const url = `https://ffars.tamisemi.go.tz/api/v1/vouchers/${id}/print?token=${user.token}`;
  // const url = `${process.env.VUE_APP_SERVER_URL}/api/v1/vouchers/${id}/print?token=${user.token}`;
  return window.open(url);
};

export {
  get,
  find,
  create,
  update,
  destroy,
  search,
  fundByActivity,
  fundByActivityFundSource,
  printPdf,
  activitiesByFundSource,
  approvePVFacility,
};
