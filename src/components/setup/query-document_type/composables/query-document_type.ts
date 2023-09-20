import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";

import { QueryDocumentType } from "../types/QueryDocumentType";
import {
  get,
  create,
  update,
  destroy,
  searchCategories,
} from "../services/query-document_type.service";
import { get as getQueryCategories } from "../../query-category/services/query-category.service";

export const useQueryDocumentType = (): any => {
  const dataItems: Array<QueryDocumentType> = [];
  let documentCategoryData: QueryDocumentType;

  const data = reactive({
    file: "",
    title: "Query Document Type",
    modalTitle: "",
    headers: [
      {
        text: "Query Type",
        align: "start",
        sortable: false,
        value: "queryCategory.name",
      },
      { text: "Document Type", align: "start", sortable: false, value: "name" },
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
    queryCategories: [],
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
      const { from, to, total, current_page, per_page, last_page } =
        response.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data;
      data.itemsToFilter = response.data;
    });
    getQueryCategories({}).then((response: any) => {
      data.queryCategories = response.data;
    });
  };

  const searchCategory = (item: string) => {
    if (item) {
      const regSearchTerm = item ? item : "";
      searchCategories({
        active: true,
        regSearch: regSearchTerm,
      }).then((response: AxiosResponse) => {
        data.queryCategories = response.data.data.data;
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
    data.formData = {} as QueryDocumentType;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as QueryDocumentType;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
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
      data.formData = {} as QueryDocumentType;
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

  const deleteDialog = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
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
