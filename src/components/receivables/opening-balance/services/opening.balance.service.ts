import axios from "axios";

const API = "/api/v1/opening-balances";

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

export {
  get,
  find,
  create,
};
