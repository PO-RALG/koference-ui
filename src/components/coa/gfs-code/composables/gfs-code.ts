import { AxiosResponse } from "axios";
import { GfsCodes } from "../types/";
import { reactive, watch, onMounted, ref } from "@vue/composition-api";

import { get, create, update, destroy, search } from "../service/gfs.service";
import { gfscategories } from "../../gfs-category/service/gfs-categories.service";

export const useGfsCode = (): any => {
  const dataItems: Array<GfsCodes> = [];
  let gfsCategoryData: GfsCodes;
  const fileToupload = ref("");
  const imageUrl: any = ref("");

  const data = reactive({
    title: "Manage Gfs Codes",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      { text: "Code", align: "start", sortable: false, value: "code" },
      {
        text: "Category code",
        align: "start",
        sortable: false,
        value: "category.description",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: gfsCategoryData,
    documentcategories: [],
    gfscategories: [],
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
  });

  onMounted(() => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });

    gfscategories({ per_page: 2000 }).then((response: any) => {
      data.gfscategories = response.data.data.data;
    });
  });

  const searchCategory = (categoryName) => {
    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
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

  const deleteGfsCode = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const getGfsCode = () => {
    get(data).then((response) => {
      // console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as GfsCodes;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as GfsCodes;
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
      updateGfsCodes(data.formData);
    } else {
      createGfsCode(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as GfsCodes;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateGfsCodes = (data: any) => {
    update(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

  const createGfsCode = (data: any) => {
    create(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };
  // watching a getter

  watch(fileToupload, (fileToupload: any) => {
    if (!(fileToupload instanceof File)) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(fileToupload);

    fileReader.addEventListener("load", () => {
      imageUrl.value = fileReader.result;
    });
  });

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const fetch = async () => {
    await get({ per_page: 1000 });
  };

  return {
    data,
    openDialog,
    cancelDialog,
    deleteGfsCode,
    getGfsCode,
    updateGfsCodes,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    imageUrl,
    getData,
    getGfsCodes: get,
    fetch,
  };
};
