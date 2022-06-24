import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/facilities", { params });
};

const search = async (payload: any) => {
  return await axios.get(`/api/v1/facilities/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id) => {
  return await axios.get(`/api/v1/facilities/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/facilities`, payload);
};

const createFacilityFromPlanrep = async () => {
  return await axios.post(`/api/v1/facilities`);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/facilities/` + payload.id, payload);
};

const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/facilities/` + payload);
};

export {
  get,
  find,
  create,
  update,
  destroy,
  search,
  createFacilityFromPlanrep,
};
