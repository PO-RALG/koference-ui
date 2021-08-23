import axios from "axios";
const API = "api/v1/financial-years";

const getAcademicYears = async (payload) => {
  return axios.get(API, { params: payload });
};

export { getAcademicYears };
