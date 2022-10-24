import { AxiosResponse } from "axios";
import { reactive, onMounted, ref } from "vue";

import { GfsCategories } from "../types/";
import {
  get,
  create,
  update,
  destroy,
  search,
} from "../service/gfs-categories.service";
import { getTypes, getNature } from "../../account/services/account.service";

export const useGfsCategory = (): any => {
  const dataItems: Array<GfsCategories> = [];
  let documentCategoryData: GfsCategories;
  const imageUrl: any = ref("");

  const data = reactive({
    title: "Manage Gfs Categories",
    searchTerm: "",
    modalTitle: "",
    headers: [
      {
        text: "Open to View Gfs Codes",
        align: "start",
        sortable: false,
        value: "code",
      },
      {
        text: "Category Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Nature",
        align: "start",
        sortable: false,
        value: "account_nature",
      },
      {
        text: "Type",
        align: "start",
        sortable: false,
        value: "account_type",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    gfsCodes: [
      { text: "Gfs Name", align: "start", sortable: false, value: "name" },
      { text: "Gfs Code", align: "start", sortable: false, value: "code" },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    ACCOUNT_TYPES: [],
    ACCOUNT_NATURE: [],
    itemsToFilter: [],
    formData: documentCategoryData,
    params: {
      total: 10,
      size: 10,
    },
    documentcategories: [],
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
  });

  onMounted(() => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
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
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });

    getAccounts();
  });

  const getAccounts = () => {
    getTypes().then((response) => {
      data.ACCOUNT_TYPES = response.data.data;
    });

    getNature().then((response) => {
      data.ACCOUNT_NATURE = response.data.data;
    });
  };

  const searchCategory = (categoryName) => {
    console.log("argument", categoryName);

    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
        //// data", response);
        data.items = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const deleteGfsCategory = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };
  const getGfsCategory = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as GfsCategories;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as GfsCategories;
    data.deletemodal = false;
  };

  const remove = () => {
    console.log("delete data with id", data.itemtodelete);
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    console.log("Form Data", data.formData);
    if (data.formData.id) {
      updateGfsCategory(data.formData);
    } else {
      createCategory(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as GfsCategories;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateGfsCategory = (data: any) => {
    update(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

  const createCategory = (data: any) => {
    create(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };
  // watching a getter

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };
  const filterGfscategory = () => {
    if (data.searchTerm.length >= 3) {
      get({ regSearch: data.searchTerm }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    }
    if (data.searchTerm.length === 0) {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    }
  };

  const resetSearchText = () => {
    data.searchTerm = "";
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  return {
    data,
    getData,
    openDialog,
    cancelDialog,
    deleteGfsCategory,
    getGfsCategory,
    updateGfsCategory,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    imageUrl,
    filterGfscategory,
    resetSearchText,
  };
};
