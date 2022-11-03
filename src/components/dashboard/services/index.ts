import axios from "axios";

const API = "/api/v1/dashboard/summary";

export const get = async (params: any) => {
  return await axios.get(`${API}`, { params });
};
