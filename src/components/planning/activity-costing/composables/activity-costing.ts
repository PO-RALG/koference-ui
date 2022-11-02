import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";

import {
  get,
  create,
  update,
  destroy,
  search,
  printPdf,
} from "../services/activity-costing.service";
import { ActivityCosting } from "../types/ActivityCosting";
import { get as FinancialYears } from "../../../setup/financial-year/services/financialyear.service";

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
      /*   {
        text: "Activity",
        align: "start",
        sortable: false,
        value: "activity.description",
      },*/
      {
        text: "Account",
        align: "start",
        sortable: false,
        value: "account.code",
      },
      {
        text: "Activity code",
        align: "start",
        sortable: false,
        value: "activity.code",
      },
      {
        text: "Activity Description",
        align: "start",
        sortable: false,
        value: "activity.description",
      },
      {
        text: "GFS name",
        align: "start",
        sortable: false,
        value: "gfs_code.name",
      },
      {
        text: "Funding Source",
        align: "start",
        sortable: false,
        value: "funding_source.description",
      },
      {
        text: "Budget Type",
        align: "start",
        sortable: false,
        value: "budget_type",
      },
      {
        text: "Amount",
        align: "end",
        sortable: false,
        value: "amount",
      },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    financialYearToFilter: [],
    formData: activityCostingData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    searchTerm: "",
  });

  onMounted(() => {
    getTableData();
  });

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
    FinancialYears({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.financialYearToFilter = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const searchItem = (itemName: ActivityCosting) => {
    if (itemName != null) {
      search({ code: itemName.activity.code }).then(
        (response: AxiosResponse) => {
          data.items = response.data.data.data;
        }
      );
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

  const searchItemByFYear = (itemName: ActivityCosting) => {
    if (itemName != null) {
      search({ financial_year_id: itemName.id }).then(
        (response: AxiosResponse) => {
          data.items = response.data.data.data;
        }
      );
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

  const filterActivity = () => {
    if (data.searchTerm.length >= 3) {
      get({ regSearch: data.searchTerm }).then((response: AxiosResponse) => {
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
      });
    }
    if (data.searchTerm.length === 0) {
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
      });
    }
  };

  const printActivityCosting = () => {
    printPdf();
  };

  return {
    data,
    printActivityCosting,
    openDialog,
    cancelDialog,
    openConfirmDialog,
    updateActivityCosting,
    save,
    remove,
    cancelConfirmDialog,
    searchItem,
    getData,
    searchItemByFYear,
    resetSearchText,
    filterActivity,
  };
};
