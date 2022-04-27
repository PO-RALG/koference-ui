import axios from "axios";
import { AxiosResponse } from "axios";

const API = "/api/v1/gl-transactions";

const get = async (payload?: any): Promise<AxiosResponse> => {
  return await axios.get(`${API}`, { params: payload });
};

export { get };
