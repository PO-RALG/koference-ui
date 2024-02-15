import { reactive, computed, onMounted } from "vue";
import { AxiosResponse } from "axios";

import { QueryCategory } from "../types/QueryCategory";
import {
  get,
  create,
  update,
  destroy,
  searchCategories,
} from "../services/query-category.service";
import { printReportJasper } from "../../../../components/report/services/report.services";

export const useQueryCategory = (): any => {
  const dataItems: Array<QueryCategory> = [];
  let documentCategoryData: QueryCategory;

  const data = reactive({
    file: "",
    title: "Abstracts",
    modalTitle: "",
    headers: [
      {
        text: "Submitted by",
        align: "start",
        sortable: false,
        value: "fullName",
      },
      { text: "Author", align: "start", sortable: false, value: "author" },
      { text: "Date", align: "start", sortable: false, value: "createdAt" },
      {
        text: "Sub Theme",
        align: "start",
        sortable: false,
        value: "subTheme.name",
      },
      {
        text: "Title",
        align: "start",
        sortable: false,
        value: "title",
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

  const printFromServer = (abstractId) => {
    const params = {
      abstract_id: abstractId,
    };
    printReportJasper("abstract", params);
  };

  const initialize = () => {
    get().then((response: AxiosResponse) => {
      console.log("res", response.data);
      const { from, to, total, current_page, per_page, last_page } =
        response.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data;
      data.itemsToFilter = response.data;
    });
    // get({ per_page: 10 }).then((response: AxiosResponse) => {
    //   console.log("res", response.data);
    //   const { from, to, total, current_page, per_page, last_page } =
    //     response.data;
    //   data.response = { from, to, total, current_page, per_page, last_page };
    //   data.items = response.data;
    //   data.itemsToFilter = response.data;
    // });
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

  const getDocument = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as QueryCategory;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as QueryCategory;
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
      data.formData = {} as QueryCategory;
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

  const getData = (params: any) => {
    console.log("res", params);
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const deleteDialog = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };
  const users = computed(() => {
    return data.items
      .map((item: any) => {
        if (item.user) {
          return {
            ...item,

            fullName: `${item.user.first_name} ${item.user.middle_name}  ${item.user.last_name}`,
          };
        }
        return "";
      })
      .filter((x: any) => {
        return x.user != null;
      });
  });

  return {
    data,
    openDialog,
    cancelDialog,
    getDocument,
    updateQueryCategory,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    getData,
    deleteDialog,
    users,
    printFromServer,
  };
};
