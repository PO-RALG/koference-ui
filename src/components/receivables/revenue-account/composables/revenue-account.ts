import { onMounted, reactive } from "vue";
import { AxiosResponse } from "axios";
import {
  create,
  get,
  generate as regenerate,
} from "../services/revenue.account.service";
import { getFundingSourceList } from "@/components/receivables/receipt/services/receipt-service";
import { get as getGfsCodes } from "@/components/coa/gfs-code/service/gfs.service";
import { get as getSubBudgetClasses } from "@/components/coa/sub-budget-class/services/sub-budget-classes.service";
import { get as getFacilityTypes } from "@/components/facility/facility-type/services/facility-types.service";

export const useRevenueAccounts = (): any => {
  let revenueAccount: any;
  const data = reactive({
    title: "Manage Revenue Accounts ",
    modalTitle: "Generate Revenue Accounts",
    items: [],
    headers: [
      {
        text: "Facility Type Code",
        align: "start",
        sortable: false,
        value: "facility_type_code",
      },
      {
        text: "Cost Center Code",
        align: "start",
        sortable: false,
        value: "cost_center_code",
      },
      {
        text: "Sub-budget Class Code",
        align: "start",
        sortable: false,
        value: "sub_budget_class_code",
      },
      {
        text: "Fund Source Code",
        align: "start",
        sortable: false,
        value: "fund_source_code",
      },
      {
        text: "Gfs Code",
        align: "start",
        sortable: false,
        value: "gfs_code",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    itemsToFilter: [],
    formData: revenueAccount,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    gfs_searchTerm: "",
    sbc_searchTerm: "",
    facility_type_searchTerm: "",
    searchTerm: "",
    facilityTypes: {},
    subBudgetClasses: {},
    fundingSources: {},
    gfsCodes: {},
  });

  /*  facility_type_code: string;
  cost_center_code: string;
  sub_budget_class_code: string;
  fund_source_code: string;*/

  onMounted(() => {
    getData([]);
  });

  const cancelDialog = () => {
    data.formData = {};
    data.modal = !data.modal;
  };

  const openDialog = () => {
    data.formData = {};
    data.modal = !data.modal;
  };

  const save = () => {
    //console.log("Form Data", data.formData);
    createRevenueAccounts(data.formData);
  };

  const createRevenueAccounts = (data: any) => {
    create(data).then((response) => {
      //console.log("Added Revenue Accounts", response.data.data);
      cancelDialog();
      getData([]);
    });
  };
  const generate = (id: string | number) => {
    const data = {};
    regenerate(id, data).then((response) => {
      console.log("Added Revenue Accounts", response.data.data);
      getData([]);
    });
  };

  const filterFundSource = () => {
    if (data.searchTerm.length >= 2) {
      getFundingSourceList({ regSearch: data.searchTerm }).then(
        (response: AxiosResponse) => {
          data.fundingSources = response.data.data.data;
        }
      );
    }
  };
  const filterGfs = () => {
    if (data.gfs_searchTerm.length >= 2) {
      getGfsCodes({ regSearch: data.gfs_searchTerm, category: "REVENUE" }).then(
        (response: AxiosResponse) => {
          data.gfsCodes = response.data.data.data;
        }
      );
    }
  };

  const filterSubBudgetClasses = () => {
    if (data.sbc_searchTerm.length >= 2) {
      getSubBudgetClasses({ regSearch: data.sbc_searchTerm }).then(
        (response: AxiosResponse) => {
          data.subBudgetClasses = response.data.data.data;
        }
      );
    }
  };

  const filterFacilityTypes = () => {
    if (data.facility_type_searchTerm.length >= 1) {
      getFacilityTypes({ regSearch: data.facility_type_searchTerm }).then(
        (response: AxiosResponse) => {
          data.facilityTypes = response.data.data.data;
        }
      );
    }
  };

  const getData = (params: any) => {
    get(params).then((response: AxiosResponse) => {
      data.items = response.data.data.data;
    });
  };

  return {
    data,
    getData,
    openDialog,
    cancelDialog,
    save,
    filterFundSource,
    filterGfs,
    filterSubBudgetClasses,
    filterFacilityTypes,
    generate,
  };
};
