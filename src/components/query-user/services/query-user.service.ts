import axios from "axios";

const get = async (id: string | number) => {
  return await axios.get(`/api/v1/users/${id}`);
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/users/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};
const searchCategories = async (payload: any) => {
  return await axios.get(`/api/v1/users/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/users/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/users`, payload);
};

const update = async (payload: any) => {
  return await axios.patch(`/api/v1/users/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/users/` + payload);
};

export { get, find, create, update, destroy, search, searchCategories };
