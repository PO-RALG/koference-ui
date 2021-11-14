import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/vouchers/creditors", { params });
};
const search = async (payload: any) => {
  return await axios.get(`/api/v1/vouchers/creditors`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/vouchers/${id}`);
};

export { get, find, search };
