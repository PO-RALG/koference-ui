import axios from "axios";

const authenticate = async (payload: any) => {
  return axios.post("/api/v2/authenticate", payload);
};

export { authenticate };
