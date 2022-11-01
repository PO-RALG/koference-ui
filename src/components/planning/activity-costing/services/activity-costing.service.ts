import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/activity-costings", { params });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/activity-costings/`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/activity-costings/${id}`);
};

const create = async (payload: any) => {
  return await axios.post(`/api/v1/activity-costings`, payload);
};

const update = async (payload: any) => {
  return await axios.put(`/api/v1/activity-costings/` + payload.id, payload);
};
const destroy = async (payload: any) => {
  return await axios.delete(`/api/v1/activity-costings/` + payload);
};

const printPdf = (id: number) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  // const url = `${
  //   import.meta.env.VITE_APP_SERVER_URL
  // }/api/v1/activity-costings/1/print?token=${user.token}`;
  const url = `/api/v1/activity-costings/1/print?token=${user.token}`;
  return window.open(url);
};

export { get, find, create, update, destroy, search, printPdf };
