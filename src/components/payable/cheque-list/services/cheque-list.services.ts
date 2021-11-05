import axios from "axios";

const get = async (params: any) => {
  return await axios.post("/api/v1/vouchers/creditors",  {params});
};
const search = async (payload: any) => {
  return await axios.post(`/api/v1/vouchers/creditors`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/vouchers/${id}`);
};

const getPayments = async (id: string | number) => {
  return await axios.post("/api/v1/vouchers/creditors",  {id});
}

export { get, find, search, getPayments };
