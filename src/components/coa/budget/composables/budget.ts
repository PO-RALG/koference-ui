import { AxiosResponse } from "axios";
import { reactive, onMounted } from "vue";
import {
  get,
  getCouncils,
  getLocation as locationSearch,
} from "../services/budget.service";

let councilId: number;
export const useBudget = (): any => {
  const data = reactive({
    title: "Sync Planrep Budget By Council",
    modalTitle: "",
    councilId: councilId,
    councils: null,
    searchTerm: "",
    response: {},
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
    } else {
      console.log("No council id selected");
    }
  };

  const filterLocation = () => {
    if (data.searchTerm.length >= 3) {
      locationSearch({
        regSearch: data.searchTerm,
        search: JSON.stringify({ level_id: 3 }),
      }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = {
          from,
          to,
          total,
          current_page,
          per_page,
          last_page,
        };
        data.councils = response.data.data.data;
      });
    }
    if (data.searchTerm.length === 0) {
      locationSearch({
        per_page: 200,
        search: JSON.stringify({ level_id: 3 }),
      }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = {
          from,
          to,
          total,
          current_page,
          per_page,
          last_page,
        };
        data.councils = response.data.data.data;
      });
    }
  };

  return {
    data,
    getData,
    getCouncils,
    filterLocation,
  };
};
