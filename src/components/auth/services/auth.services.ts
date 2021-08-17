import axios from "axios";

const authenticate = async (payload) => {
  return axios.post("/api/v2/authenticate", payload);
};

export { authenticate };
