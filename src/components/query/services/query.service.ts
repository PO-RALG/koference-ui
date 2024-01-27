import axios from "axios";
const APIONEQUERY = "/api/v1/queries/oneQuery";
const APIONEUSER = "/api/v1/users/users/oneUser";
const APIONEUSERByNames = "/api/v1/users/users/oneUser/ByNames";
const APIMANYCLOSEDQUERY = "/api/v1/queries/manyQuery/closed";

const APIMANYQUERYFILTEROPENED = "/api/v1/queries/manyQuery";
const APIMANYQUERYFILTERCLOSED = "/api/v1/queries/manyQuery/filterClosed";

const trackOneQuery = async (payload: any) => {
  // console.log("data", payload);
  return await axios.get(`${APIONEQUERY}`, { params: payload });
};
const trackOneUser = async (payload: any) => {
  // console.log("data", payload);
  return await axios.get(`${APIONEUSER}`, { params: payload });
};
const trackOneUserByNames = async (payload: any) => {
  // console.log("data", payload);
  return await axios.get(`${APIONEUSERByNames}`, { params: payload });
};

const get = async (payload: any) => {
  return await axios.get("/api/v1/queries", { params: payload });
};

const getClosed = async (payload: any) => {
  return await axios.get(`${APIMANYCLOSEDQUERY}`, { params: payload });
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

const filterQueries = async (payload: any) => {
  console.log("data", payload);
  return await axios.get(`${APIMANYQUERYFILTEROPENED}`, { params: payload });
};

const filterQueriesClosed = async (payload: any) => {
  console.log("data", payload);
  return await axios.get(`${APIMANYQUERYFILTERCLOSED}`, { params: payload });
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
  filterQueries,
  getClosed,
  filterQueriesClosed,
  trackOneUserByNames,
};
