import { AxiosResponse } from "axios";
import { reactive, onMounted, ref } from "@vue/composition-api";

import { GfsCategories } from "../types/";
import { get, create, update, destroy, search } from "../service/gfs-categories.service";

export const useGfsCategory = (): any => {
  const dataItems: Array<GfsCategories> = [];
  let documentCategoryData: GfsCategories;
  const fileToupload = ref("");
  const imageUrl: any = ref("");

  const data = reactive({
    title: "Manage Gfs Categories",
    modalTitle: "",
    headers: [
      {
        text: "Category Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Gfs Codes List",
        align: "start",
        sortable: false,
        value: "code",
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
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
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
  });

  const searchCategory = (categoryName) => {
    console.log("argument", categoryName);

    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
        console.log("response data", response);
        data.items = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
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
  };
};