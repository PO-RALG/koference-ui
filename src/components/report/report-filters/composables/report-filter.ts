import { AxiosResponse } from "axios";
import { GfsCodes } from "../types";
import { reactive, watch, onMounted, ref } from "vue";

import {
  get,
  create,
  update,
  destroy,
  search,
} from "../service/report-filter.service";

export const useReportFilter = (): any => {
  const dataItems: Array<GfsCodes> = [];
  let gfsCategoryData: GfsCodes;
  const fileToupload = ref("");
  const imageUrl: any = ref("");

  const data = reactive({
    title: "Manage Report Filters",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      { text: "Code", align: "start", sortable: false, value: "code" },
      // {
      //   text: "Category code",
      //   align: "start",
      //   sortable: false,
      //   value: "category.description",
      // },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: gfsCategoryData,
    documentcategories: [],
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    searchTerm: "",
  });

  onMounted(() => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
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

  const deleteReportFilter = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
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
      updateReportFilter(data.formData);
    } else {
      createReportFilter(data.formData);
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

  const updateReportFilter = (data: any) => {
    update(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

  const createReportFilter = (data: any) => {
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

  const filterReportFilter = () => {
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
    openDialog,
    cancelDialog,
    deleteReportFilter,
    updateReportFilter,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    imageUrl,
    getData,
    fetch,
    filterReportFilter,
    resetSearchText,
  };
};
