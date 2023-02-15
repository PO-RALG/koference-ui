import axios from "axios";

const API = "/api/v1/receipt/approval-pending-council";
const APIFUNDINGSOURCES = "/api/v1/funding-sources";
const APIAPPROVAL = "/api/v1/receipt-reversal/approval-council";
const APIAPPROVALL = "/api/v1/receipt/approvalCouncil";

const get = async (payload: any) => {
  return await axios.get(`${API}`, {
    params: payload,
  });
};

const getFundingSourceList = async (payload: any) => {
  return await axios.get(`${APIFUNDINGSOURCES}`, { params: payload });
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

const destroy = async <T>(id: number, date: T) => {
  return await axios.delete(`${API}/${id}`, {
    data: { date },
  });
};

const regSearch = async (payload: any) => {
  return await axios.get(`/api/v1/receipts/`, { params: payload });
};

const printReceipt = (id: string | number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  const url = `${
    import.meta.env.VITE_APP_SERVER_URL
  }/api/v1/receipts/${id}?token=${user.token}`;
  // const url = `/api/v1/receipts/${id}?token=${user.token}`;
  return window.open(url);
};

const getGlAccounts = async (params: any): Promise<any> => {
  return await axios.get(`/api/v1/gl-accounts`, { params });
};

const approveReceiptFacilityService = async (payload: any) => {
  return await axios.post(`${APIAPPROVAL}`, payload);
};
const approveReceiptFacilittyService = async (payload: any) => {
  return await axios.post(`${APIAPPROVALL}`, payload);
};

export {
  create,
  destroy,
  find,
  get,
  getFundingSourceList,
  getGlAccounts,
  printReceipt,
  regSearch,
  search,
  update,
  viewinvoice,
  approveReceiptFacilityService,
  approveReceiptFacilittyService,
};
