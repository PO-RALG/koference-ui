import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";

import { QueryStatus } from "../types/QueryPriority";
import {
  get,
  create,
  update,
  destroy,
  searchCategories,
} from "../services/query-priority.service";

export const useQueryStatus = (): any => {
  const dataItems: Array<QueryStatus> = [];
  let documentCategoryData: QueryStatus;

  const data = reactive({
    file: "",
    title: "Query Statuses",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: documentCategoryData,
    documentcategories: [],
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    searchTerm: "",
    search: "",
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      console.log("res", response.data);
      const { from, to, totalPages, currentPage, itemsPerPage, last_page } =
        response.data;
      data.response = {
        from,
        to,
        totalPages,
        currentPage,
        itemsPerPage,
        last_page,
      };
      data.items = response.data.items;
      data.itemsToFilter = response.data.items;
    });
  };

  const searchCategory = (item: string) => {
    if (item) {
      const regSearchTerm = item ? item : "";
      searchCategories({
        active: true,
        regSearch: regSearchTerm,
      }).then((response: AxiosResponse) => {
        data.documentcategories = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, totalItems, current_page, per_page, last_page } =
        response.data;
      data.response = {
        from,
        to,
        totalItems,
        current_page,
        per_page,
        last_page,
      };
      data.items = response.data;
    });
  };

  const getData = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as QueryStatus;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as QueryStatus;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const deleteDialog = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const save = () => {
    if (data.formData.id) {
      updateQueryCategory(data.formData);
    } else {
      createData(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as QueryStatus;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateQueryCategory = (data: any) => {
    update(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const createData = (data: any) => {
    create(data).then((response) => {
      if (response.status === 201) {
        reloadData();
        cancelDialog();
      }
    });
  };

  return {
    data,
    openDialog,
    cancelDialog,
    getData,
    updateQueryCategory,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    deleteDialog,
  };
};
