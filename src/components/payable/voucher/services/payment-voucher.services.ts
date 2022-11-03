import axios from "axios";

const getWorkflow = async (params: any) => {
  return await axios.get("/api/v1/work-flows-actions", { params });
};

const approvePVFacilityService = async (payload: any) => {
  return await axios.post(`/api/v1/payment_voucher/approval`, payload);
};

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

const requestVoucherApproval = async (id: number) => {
  return await axios.post(`/api/v1/vouchers/${id}/request-approval`);
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
  // const url = `${
  //   import.meta.env.VITE_APP_SERVER_URL
  // }/api/v1/vouchers/${id}/print?token=${user.token}`;
  const url = `/api/v1/vouchers/${id}/print?token=${user.token}`;
  return window.open(url);
};

export {
  activitiesByFundSource,
  approvePVFacilityService,
  create,
  destroy,
  find,
  fundByActivity,
  fundByActivityFundSource,
  get,
  getWorkflow,
  printPdf,
  requestVoucherApproval,
  search,
  update,
};
