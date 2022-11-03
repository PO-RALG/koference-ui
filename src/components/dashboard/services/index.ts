import axios from "axios";

const API = "/api/v1/dashboard/summary";

const get = async (payload: any) => {
  return await axios.get(`${API}`, { params: payload });
};

export { get };
