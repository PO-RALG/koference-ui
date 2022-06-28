import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { get as getFinancialYear } from "@/components/setup/financial-year/services/financialyear.service";
import { FinancialYear } from "@/components/setup/financial-year/types/FinancialYear";
import { RevenueProjection } from "../types/RevenueProjection";
import {
  get,
  create,
  update,
  destroy,
  search,
} from "../services/revenue-projection.service";

export const useRevenueProjection = (): any => {
  const dataItems: Array<RevenueProjection> = [];
  const revenueProjectionData = {} as RevenueProjection;
  let financialYearData: [];

  const data = reactive({
    title: "Revenue Projections",
    valid: true,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Account",
        align: "start",
        sortable: false,
        value: "account.code",
      },
      {
        text: "Funding Source",
        align: "start",
        sortable: false,
        value: "funding_source_code",
      },
      {
        text: "GFS",
        align: "start",
        sortable: false,
        value: "gfs_code",
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
    formData: revenueProjectionData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    financialYearData: financialYearData,
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

    getFinancialYear({ per_page: 10, asc: "id" }).then(
      (response: AxiosResponse) => {
        data.financialYearData = response.data.data.data;
      }
    );
  };

  const searchItem = (itemName: RevenueProjection) => {
    if (itemName != null) {
      search({ funding_source_code: itemName.funding_source_code }).then(
        (response: AxiosResponse) => {
          data.items = response.data.data.data;
        }
      );
    }
  };

  const selectFinancialYear = (year: FinancialYear) => {
    if (year != null) {
      get({ financial_year_id: year.id }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.items = response.data.data.data;
        data.response = {
          from,
          to,
          total,
          current_page,
          per_page,
          last_page,
        };
      });
    }
  };

  const getData = (params: RevenueProjection) => {
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
    data.formData = {} as RevenueProjection;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as RevenueProjection;
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
      updateRevenueProjection(data.formData);
    } else {
      createRevenueProjection(data.formData);
    }
  };

  const openDialog = (formData?: RevenueProjection) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as RevenueProjection;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateRevenueProjection = (data: RevenueProjection) => {
    update(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const createRevenueProjection = (data: RevenueProjection) => {
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
    updateRevenueProjection,
    save,
    remove,
    cancelConfirmDialog,
    searchItem,
    getData,
    selectFinancialYear,
  };
};
