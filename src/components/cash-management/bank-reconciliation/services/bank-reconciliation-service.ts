import axios from "axios";
import { AxiosResponse } from "axios";

const API = "api/v1/bank-reconciliation";

const get = async (payload: any): Promise<AxiosResponse> => {
  return axios.get(API, { params: payload });
};

const find = async (id: string | number): Promise<AxiosResponse> => {
  if (id) return axios.get(`${API}/${id}`);
};

const create = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${API}`, payload);
};

const addBalance = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${API}/add-balance`, payload);
};

const getReport = async (params: any): Promise<AxiosResponse> => {
  return await axios.get(`${API}/statement`, { params });
};

const reconcileEntries = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${API}/reconcile`, payload);
};

const getEntries = async (params: any): Promise<AxiosResponse> => {
  return await axios.get(`${API}/get-entries`, { params });
};

const confirmReport = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${API}/confirm`, payload);
};

const unlock = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${API}/unlock-report`, payload);
};

export {
  addBalance,
  confirmReport,
  create,
  find,
  get,
  getEntries,
  getReport,
  reconcileEntries,
  unlock,
};
