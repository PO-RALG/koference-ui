import axios from "axios";

const get = async (payload: any) => {
  return await axios.get("/api/v1/query-statuses", { params: payload });
};

export { get };
