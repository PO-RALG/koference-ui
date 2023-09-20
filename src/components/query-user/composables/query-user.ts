import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";

import { QueryStatus } from "../types/QueryUser";
import {
  get,
  create,
  update,
  destroy,
  searchCategories,
} from "../services/query-user.service";
import router from "@/router";
import store from "@/store";

export const useQueryUser = (): any => {
  const dataItems: Array<QueryStatus> = [];
  let documentCategoryData: QueryStatus;

  const data = reactive({
    file: "",
    title: "Assigned Queries",
    modalTitle: "",
    headers: [
      {
        text: "Created Date",
        align: "start",
        sortable: false,
        value: "created_date",
      },
      {
        text: "Category",
        align: "start",
        sortable: false,
        value: "queryCategory.name",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: "Status",
        align: "start",
        sortable: false,
        value: "queryStatus.name",
      },

      // { text: "Actions", value: "actions", sortable: false },
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
    showingTooltip: false,
    clickedRow: null, // Initialize to null
  });

  const getCurrentUser = () => {
    return store.getters["Auth/getCurrentUser"];
  };

  onMounted(() => {
    const usersX: any = getCurrentUser();

    initialize(usersX.id);
  });
  const handleRowClick = (rowData) => {
    data.clickedRow = rowData; // Set the clicked row data
    console.log("oneRow", rowData);

    router.push({
      name: "anotheruser",
      query: { dataz: JSON.stringify(rowData) },
    });
  };
  const showTooltip = () => {
    data.showingTooltip = true;
  };
  const hideTooltip = () => {
    data.showingTooltip = false;
  };

  const initialize = (id: number) => {
    data.items = [];
    get(id).then((response: AxiosResponse) => {
      console.log("res", response.data.queries);
      const { from, to, total, current_page, per_page, last_page } =
        response.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.queries;
      data.itemsToFilter = response.data.queries;
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
      const { from, to, total, current_page, per_page, last_page } =
        response.data;
      data.response = { from, to, total, current_page, per_page, last_page };
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
    showTooltip,
    hideTooltip,
    handleRowClick,
  };
};
