import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/document-categories", { params: payload });
};
const documentcategoried = async () => {
  return await axios.get("/api/v1/document-categories");
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/document-categories/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/document-categories/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/document-categories`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/document-categories/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  console.log("payload", payload);
  return await axios.delete(`/api/v1/document-categories/` + payload);
};

export { get, find, create, update, destroy, search, documentcategoried };
