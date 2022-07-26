import { AxiosResponse } from "axios";
import { reactive, onMounted } from "@vue/composition-api";
import {
  get,
  getCouncils
} from "../services/budget.service";

let councilId:number;
export const useBudget = (): any => {


  const data = reactive({
    title: "Sync Planrep Budget By Council",
    modalTitle: "",
    councilId: councilId,
    councils : null
  });

  onMounted(() => {
    getCouncils({ per_page: 200 }).then((response: AxiosResponse) => {
      data.councils = response.data.data.data;
    });
  });

  const getData = () => {
    if (data.councilId) {
      get(data.councilId).then((response: AxiosResponse) => {
       // data.councils = response.data.data.data;
      });
      //get({"councilId":councilId});
    }else{
      console.log("No council id selected");
    }


  };

  return {
    data,
    getData,
    getCouncils
  };
};
