import { AxiosResponse } from "axios";
import { reactive, onMounted, computed } from "vue";

import { Entry, GLTransaction, newEntry } from "../types";
import { get } from "../services/gl-transaction-services";

export const useGLTransaction = (): any => {
  const EntryObject = newEntry();
  const HEADERS = [
    { text: "Date", value: "apply_date" },
    { text: "Reference", value: "reference" },
    { text: "Total", value: "total" },
  ];

  const ENTRIES_HEADERS = [
    { text: "Description", value: "description" },
    { text: "Account", value: "account" },
    { text: "DR", value: "dr_amount" },
    { text: "CR", value: "cr_amount" },
  ];

  const data = reactive({
    items: [],
    expanded: [],
    title: "GL Transactions",
    singleExpand: false,
  });

  onMounted(() => {
    init();
  });

  const init = () => {
    get({ per_page: 200 }).then((response: AxiosResponse) => {
      data.items = response.data.data.data;
    });
  };

  const sum = (entries) => {
    let total = 0.0;
    entries.forEach((entry) => {
      total += parseFloat(entry.dr_amount);
    })
    return total;
  };

  const entries = computed(() => {
    return data.items.map((entry) => ({
      ...entry,
      total: sum(entry.gl_entries),
    }));
  });

  return {
    HEADERS,
    ENTRIES_HEADERS,
    data,
    entries,
  };
};
