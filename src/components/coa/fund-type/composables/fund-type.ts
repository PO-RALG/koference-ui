import { AxiosResponse } from "axios";
import { FundTypes } from "../types";
import { reactive, onMounted } from "@vue/composition-api";
import { get, create, update, destroy, search } from "../service/fund-types.service";

export const useFundType = (): any => {
  const dataItems: Array<FundTypes> = [];
  let documentCategoryData: FundTypes;

  const data = reactive({
    title: "Manage FundTypes",
    modalTitle: "",
    headers: [
      {
        text: "Desciption",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Current Code",
        align: "start",
        sortable: false,
        value: "current_code",
      }, {
        text: "Carryover Code",
        align: "start",
        sortable: false,
        value: "carryover_code",
      }
    ],

    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: documentCategoryData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    documentcategories: [],
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
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const deleteFundType = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const cancelDialog = () => {
    data.formData = {} as FundTypes;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as FundTypes;
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
      updateFundType(data.formData);
    } else {
      createFundType(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as FundTypes;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateFundType = (data: any) => {
    update(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

  const createFundType = (data: any) => {
    create(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

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
    deleteFundType,
    updateFundType,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
  };
};
