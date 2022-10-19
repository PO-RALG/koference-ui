import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { get, create, update, destroy, search } from "../services/sub-budget-classes.service";
import { fundingtypes } from "../../fund-type/service/fund-types.service";
import { SubBudgetClass } from "../types/SubBudgetClass";

export const useSubBudgetClass = (): any => {
  const dataItems: Array<SubBudgetClass> = [];
  let documentCategoryData: SubBudgetClass;

  const data = reactive({
    title: "Manage Sub Budget Class",
    modalTitle: "",
    headers: [
      { text: "Code", align: "start", sortable: false, value: "code" },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: "Fund Type Code",
        align: "start",
        sortable: false,
        value: "funding_type.code",
      },
      {
        text: "CarryOver Fund Type Code",
        align: "start",
        sortable: false,
        value: "carryover_fund_type.code",
      }
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
    fundingtypes: [],
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

    fundingtypes().then((response: any) => {
      data.fundingtypes = response.data.data.data;
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

  const deleteSubBudgetClass = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const cancelDialog = () => {
    data.formData = {} as SubBudgetClass;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as SubBudgetClass;
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
      updateSubBudgetClass(data.formData);
    } else {
      createSBC(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as SubBudgetClass;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateSubBudgetClass = (data: any) => {
    update(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

  const createSBC = (data: any) => {
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
    deleteSubBudgetClass,
    updateSubBudgetClass,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
  };
};
