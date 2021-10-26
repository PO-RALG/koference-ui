import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { get, create, update, destroy, search } from "../services/activity-costing.service";
import { ActivityCosting } from "../types/ActivityCosting";

export const useActivityCosting = (): any => {
  const dataItems: Array<ActivityCosting> = [];
  const activityCostingData = {} as ActivityCosting;

  const data = reactive({
    title: "Activity Costings",
    valid: true,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Activity",
        align: "start",
        sortable: false,
        value: "activity.description",
      },
      {
        text: "Activity code",
        align: "start",
        sortable: false,
        value: "activity.code",
      },
      {
        text: "GFS code",
        align: "start",
        sortable: false,
        value: "gfs_code.code",
      },
      {
        text: "Funding Source",
        align: "start",
        sortable: false,
        value: "funding_source.description",
      },
      {
        text: "Amount",
        align: "start",
        sortable: false,
        value: "amount",
      },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: activityCostingData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
  });

  onMounted(() => {
    getTableData();
  });

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const searchItem = (itemName: ActivityCosting) => {
    if (itemName != null) {
      search({ code: itemName.activity.code }).then((response: AxiosResponse) => {
        data.items = response.data.data.data;
      });
    }
  };

  const getData = (params: ActivityCosting) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openConfirmDialog = (deleteId: string) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const cancelDialog = () => {
    data.formData = {} as ActivityCosting;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as ActivityCosting;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      data.deletemodal = false;
      getTableData();
    });
  };

  const save = () => {
    if (data.formData.id) {
      updateActivityCosting(data.formData);
    } else {
      createActivityCosting(data.formData);
    }
  };

  const openDialog = (formData?: ActivityCosting) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as ActivityCosting;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateActivityCosting = (data: ActivityCosting) => {
    update(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const createActivityCosting = (data: ActivityCosting) => {
    create(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  return {
    data,
    openDialog,
    cancelDialog,
    openConfirmDialog,
    updateActivityCosting,
    save,
    remove,
    cancelConfirmDialog,
    searchItem,
    getData,
  };
};
