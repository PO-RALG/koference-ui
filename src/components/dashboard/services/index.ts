import axios from "axios";

const API = "/api/v1/dashboard";

export const get = async (params: any) => {
  return await axios.get(`${API}/summary`, { params });
};

export const byMonth = async (params: any) => {
  return await axios.get(`${API}/by-month`, { params });
};

export const getCarryoverByFundSource = async (params: any) => {
  return await axios.get(`${API}/by-source-carryover`, { params });
};

export const getByCurrentSource = async (params: any) => {
  return await axios.get(`${API}/by-source-current`, { params });
};
