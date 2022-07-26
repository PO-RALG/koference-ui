import axios from "axios";
const API = "/api/v1/budgets-sync";

const get = async (payload: number|string) => {
  return await axios.get(`${API}/${payload}`);
};

const getCouncils = async (payload: any) => {

  return await axios.get(`/api/v1/admin-areas/`, {
    params: {
      search: JSON.stringify({"level_id":3}),
      per_page: 2000
    },
  });

};
export { get,getCouncils};
