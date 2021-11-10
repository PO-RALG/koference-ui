import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/invoice-item-definitions", {
    params: payload,
  });
};
const itemdefinitions = async (payload: any) => {
  return await axios.get("/api/v1/invoice-item-definitions", {
    params: payload,
  });
};
const glAccounts = async (payload: any) => {
  return await axios.get("/api/v1/gl-accounts", {
    params: {
      search: JSON.stringify(payload),
    },
  });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/invoice-item-definitions/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/invoice-item-definitions/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/invoice-item-definitions`, payload);
};

const update = async (payload: any) => {
  return await axios.put(
    `/api/v1/invoice-item-definitions/` + payload.id,
    payload
  );
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/invoice-item-definitions/` + payload);
};

const activation = async (payload: any) => {
  return await axios.post(
    `/api/v1/invoice-item-definitions/` + payload.id + "/change-status",
    payload
  );
};

export {
  get,
  find,
  create,
  update,
  destroy,
  search,
  itemdefinitions,
  glAccounts,
  activation,
};
