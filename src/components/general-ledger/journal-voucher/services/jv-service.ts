import axios from "axios";
import { AxiosResponse } from "axios";

const API = "/api/v1/journal-vouchers";

const get = async (payload?: any): Promise<AxiosResponse> => {
  return await axios.get(`${API}`, { params: payload });
};

const create = async (payload: any): Promise<AxiosResponse> => {
  return await axios.post(`${API}`, payload);
};

export { get, create };
