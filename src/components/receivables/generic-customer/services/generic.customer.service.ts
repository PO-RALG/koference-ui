import axios from "axios";
const API = "api/v1/customers-template";

const get = async (payload: any) => {
  return await axios.get(API, { params: payload });
};
const customers = async (payload: any) => {
  return await axios.get(API, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};
const search = async (payload: any) => {
  return await axios.get(API, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const activation = async (payload: any) => {
  return await axios.post(`${API}/${payload.id}/change-status`, payload);
};

const find = async (id: string | number) => {
  return await axios.get(`${API}/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(API, payload);
};

const update = async (payload: any) => {
  return await axios.put(`${API}/${payload.id}`, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`${API}/${payload}`);
};

export { get, find, create, update, destroy, search, activation, customers };
