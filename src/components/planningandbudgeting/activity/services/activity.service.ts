import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/activities",  {params});
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/activities/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/activities/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/activities`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/activities/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/activities/` + payload);
};

export { get, find, create, update, destroy, search };
