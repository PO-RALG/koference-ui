import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/customers-template", { params: payload });
};
const customers = async (payload: any) => {
  return await axios.get("/api/v1/customers-template", {
    params: {
      search: JSON.stringify(payload),
    },
  });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/customers-template/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const regSearch = async (payload: any) => {
  return await axios.get(`/api/v1/customers-template/`, { params: payload });
};

const activation = async (payload: any) => {
  return await axios.post(
    `/api/v1/customers-template/` + payload.id + "/change-status",
    payload
  );
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/customers-template/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/customers-template`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/customers-template/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/customers-template/` + payload);
};

export {
  get,
  find,
  create,
  update,
  destroy,
  search,
  activation,
  customers,
  regSearch,
};
