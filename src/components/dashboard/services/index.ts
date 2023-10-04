import axios from "axios";

const API = "/api/v1/queries";

export const get = async (params: any) => {
  return await axios.get(`${API}/summary`, { params });
};
export const getByCategory = async (params: any) => {
  return await axios.get(`${API}/querybyCategory`, { params });
};
export const getByNature = async (params: any) => {
  return await axios.get(`${API}/querybyNature`, { params });
};
export const queryTopFive = async (params: any) => {
  return await axios.get(`${API}/queryTopFive`, { params });
};

export const queryByGender = async (params: any) => {
  return await axios.get(`${API}/queryByGender`, { params });
};
export const querySummary = async (params: any) => {
  return await axios.get(`${API}/querySummary`, { params });
};
