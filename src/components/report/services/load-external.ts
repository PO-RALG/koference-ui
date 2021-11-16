import axios from "axios";
import { AxiosResponse } from "axios";

interface Params {
  per_page: number;
}

const FUND_SOURCE_API = "api/v1/funding-sources";
const FINANCIAL_YEAR_API = "api/v1/financial-years";
const FACILITY_API = "api/v1/facilities";
const FACILITY_TYPE_API = "api/v1/facility-types";
const LOCATION_API = "api/v1/admin-areas";
const GFS_CODE_API = "api/v1/gfs-codes";
const GL_ACCOUNT_API = "api/v1/gl-accounts";
const BANK_ACCOUNT_API = "api/v1/bank-accounts";

const get = async (params: Params, type: string): Promise<AxiosResponse> => {
  switch (type) {
    case "FUND_SOURCE":
      return axios.get(FUND_SOURCE_API, { params })
        .then((response: AxiosResponse) => response.data.data);
    case "FINANCIAL_YEAR":
      return axios.get(FINANCIAL_YEAR_API, { params })
        .then((response: AxiosResponse) => response.data.data);
    case "FACILITY":
      return axios.get(FACILITY_API, { params })
        .then((response: AxiosResponse) => response.data.data);
    case "FACILITY_TYPE":
      return axios.get(FACILITY_TYPE_API, { params })
        .then((response: AxiosResponse) => response.data.data);
    case "LOCATION":
      return axios.get(LOCATION_API, { params })
        .then((response: AxiosResponse) => response.data.data);
    case "GFS_CODE":
      return axios.get(GFS_CODE_API, { params })
        .then((response: AxiosResponse) => response.data.data);
    case "GL_ACCOUNT":
      return axios.get(GL_ACCOUNT_API, { params })
        .then((response: AxiosResponse) => response.data.data);
    case "BANK_ACCOUNT":
      return axios.get(BANK_ACCOUNT_API, { params })
        .then((response: AxiosResponse) => response.data.data);
  }
};

export { get };
