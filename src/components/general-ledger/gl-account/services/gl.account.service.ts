import axios from "axios";
import { AxiosResponse } from "axios";

const API = "/api/v1/gl-accounts";
const adjustmentAccountsAPI = "/api/v1/gl-accounts/filter/cash-adjustment";

const get = async (payload?: any): Promise<AxiosResponse> => {
  return await axios.get(`${API}`, { params: payload });
};
const getAdjustmentAccount = async (payload?: any): Promise<AxiosResponse> => {

  return await axios.get(`${adjustmentAccountsAPI}`, { params: payload });
};

const create = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${API}`, payload);
};

const toggleStatus = async (id: string | number): Promise<AxiosResponse> => {
  return await axios.post(`${API}/${id}/toggle-status`);
};

export { getAdjustmentAccount,get, create, toggleStatus };
