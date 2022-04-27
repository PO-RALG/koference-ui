import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/suppliers",  {params});
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/suppliers/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/suppliers/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/suppliers`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/suppliers/` + payload.id, payload);
};

const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/suppliers/` + payload);
};

const activation = async (payload: any) => {
  return await axios.post(
    `/api/v1/suppliers/` + payload.id + "/change-status",
    payload
  );
};

export { get, find, create, update, destroy, search, activation };
