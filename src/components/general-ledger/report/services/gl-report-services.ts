import axios from "axios";
import { AxiosResponse } from "axios";
const API = "/api/v1/gl-statement-reports";

const get = async (payload?: any): Promise<AxiosResponse> => {
  return await axios.get(`${API}`, { params: payload });
};

const printPdf = (payload?: any) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  let url = `${process.env.VUE_APP_SERVER_URL}${API}?print_type=${payload.print_type}
  &token=${user.token}`;
  return window.open(url);
}

export { get, printPdf };
