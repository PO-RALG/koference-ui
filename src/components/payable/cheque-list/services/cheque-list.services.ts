import axios from "axios";

const get = async (params: any) => {
  return await axios.get("/api/v1/cheque-lists",  {params});
};
const search = async (payload: any) => {
  return await axios.post(`/api/v1/cheque-lists`, {
    params: {
      search: JSON.stringify(payload),
    },
  });
};

const find = async (id: string | number) => {
  return await axios.get(`/api/v1/cheque-lists/${id}`);
};

const getPayments = async (data: any) => {
  return await axios.post(`/api/v1/cheque-lists/items`, data);
}

export { get, find, search, getPayments };
