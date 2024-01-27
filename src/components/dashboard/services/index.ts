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

export const uploadFile = async (payload: any) => {
  // console.log("upload", payload);
  return axios.post("/api/v1/files/upload", payload);
};
export const saveRegistration = async (payload: any) => {
  // console.log("upload", payload);
  return axios.post("/api/v1/jisajilis", payload);
};

export const getRegInfo = async (payload: any) => {
  return await axios.get(`/api/v1/jisajilis/jisajilis/search`, {
    params: payload,
  });
};

export const getRegInfox = async (payload: any) => {
  // console.log("data", payload);
  return await axios.get(`/api/v1/jisajilis/jisajilis/search`, {
    params: payload,
  });
};
