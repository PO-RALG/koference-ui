import axios from "axios";
import { AxiosResponse } from "axios";

const API = "/api/v1/gl-accounts";

const get = async (payload?: any): Promise<AxiosResponse> => {
  return await axios.get(`${API}`, { params: payload });
};

const create = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${API}`, payload);
};

const toggleStatus = async (id: string | number): Promise<AxiosResponse> => {
  return await axios.post(`${API}/${id}/toggle-status`);
};

export { get, create, toggleStatus };
