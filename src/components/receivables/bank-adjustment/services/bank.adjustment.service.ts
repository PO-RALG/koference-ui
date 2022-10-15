import axios from "axios";

const API = "/api/v1/bank-adjustments";
const APIAPPROVAL = "/api/v1/bank_adjustment/approval";

const get = async (payload: any) => {
  return await axios.get(`${API}`, {
    params: payload,
  });
};

const find = async (id: string | number) => {
  return await axios.get(`${API}/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`${API}`, payload);
};

const destroy = async (id: string | number) => {
  return await axios.delete(`${API}/${id}`);
};

const approveBAFacilityService = async (payload: any) => {
  return await axios.post(`${APIAPPROVAL}`, payload);
};

export { get, find, create, destroy, approveBAFacilityService };
