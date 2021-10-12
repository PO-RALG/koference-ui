import { reactive, onMounted } from "@vue/composition-api";
import { get, create } from "../services/jv-service";

import { AxiosResponse } from "axios";

export const useJv = (): any => {
  const data = reactive({
    items: [],
  });

  onMounted(() => {
    init();
  });

  const init = () => {
    get({}).then((response: AxiosResponse) => {
      data.items = response.data.data.data;
    });
  };

  return {
    data,
  };
};
