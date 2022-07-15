import axios from "axios";
import { AxiosResponse } from "axios";
const API = "/api/v1/cashbook-report";

const get = async (payload?: any): Promise<AxiosResponse> => {
  return await axios.get(`${API}`, { params: payload });
};

const printPdf = (payload?: any) => {
  const user = JSON.parse(localStorage.getItem("FFARS_USER"));
  let  url = `${process.env.VUE_APP_SERVER_URL}${API}?print_type=${payload.print_type}
            &token=${user.token}`;
  Object.keys(payload).forEach(key => {
    if (payload[key] != null) {
      //delete ;
   url +=  `&${key}=${payload[key]}`;
    }
  });

  return window.open(url);
}

export { get, printPdf };
