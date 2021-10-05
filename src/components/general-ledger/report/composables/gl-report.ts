import { reactive, onMounted, set, ref, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import store from "@/store";
import { get } from "../services/gl-report-services";

export const useGLReport = (): any => {
  const dTable = ref(null);

  const data = reactive({
    entries: [],
    title: "General Ledger Report",
    facility: null,
  });

  const openPrintDialog = () => {
    store.dispatch("Drawer/CLOSE");
    setTimeout(function () {
      window.print();
    }, 0);
  };

  onMounted(() => {
    init();
    //set(dTable.value.expanded, "expanded", data.entries);
    for (let i = 0; i < data.entries.length; i += 1) {
      const item = data.entries[i];
      set(dTable.expanded, item.name, true);
    }
  });

  const init = () => {
    get().then((response: AxiosResponse) => {
      data.facility = response.data.data.facility;
      data.entries = response.data.data.data;
    });
  };

  const facility = computed(() => {
    return data.facility;
  });

  return {
    data,
    facility,
    dTable,
    openPrintDialog,
  };
};
