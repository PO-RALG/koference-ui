import axios from "axios";
const APIONEQUERY = "/api/v1/queries/oneQuery";
const APIONEUSER = "/api/v1/users/users/oneUser";

const trackOneQuery = async (payload: any) => {
  console.log("data", payload);
  return await axios.get(`${APIONEQUERY}`, { params: payload });
};
const trackOneUser = async (payload: any) => {
  console.log("data", payload);
  return await axios.get(`${APIONEUSER}`, { params: payload });
};

const get = async (payload: any) => {
  return await axios.get("/api/v1/queries", { params: payload });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/queries/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};
const searchCategories = async (payload: any) => {
  return await axios.get(`/api/v1/queries/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/queries/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/queries`, payload);
};

const update = async (payload: any) => {
  return await axios.patch(`/api/v1/queries/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/queries/` + payload);
};

export {
  get,
  find,
  create,
  update,
  destroy,
  search,
  searchCategories,
  trackOneQuery,
  trackOneUser,
};
