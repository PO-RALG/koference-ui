import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/query-document-types", { params: payload });
};
const getDocumentTypeCategoryFeedback = async () => {
  return await axios.get(
    `api/v1/query-document-types/getQueryDocumentFeedback`
  );
};
const getDocumentTypeCategory = async (id: string | number) => {
  return await axios.get(
    `api/v1/query-document-types/getQueryDocumentTypesByCategory/${id}`
  );
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/query-document-types/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};
const searchCategories = async (payload: any) => {
  return await axios.get(`/api/v1/query-document-types/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/query-document-types/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/query-document-types`, payload);
};

const update = async (payload: any) => {
  return await axios.patch(
    `/api/v1/query-document-types/` + payload.id,
    payload
  );
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/query-document-types/` + payload);
};

export {
  get,
  find,
  create,
  update,
  destroy,
  search,
  searchCategories,
  getDocumentTypeCategory,
  getDocumentTypeCategoryFeedback,
};
