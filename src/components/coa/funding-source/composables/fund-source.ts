import { AxiosResponse } from "axios";
import { FundSources } from "../types";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import { reactive, onMounted, computed } from "vue";
import {
  get,
  create,
  update,
  destroy,
  search,
  createFundSource,
} from "../services/funding-sources";

export const useFundSource = (): any => {
  const dataItems: Array<FundSources> = [];
  let financialYearData: FundSources;

  const data = reactive({
    title: "Manage Funding Sources",
    modalTitle: "",
    headers: [
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: "Funding Sources Code",
        align: "start",
        sortable: false,
        value: "code",
      },

      {
        text: "Actions",
        align: "center",
        sortable: false,
        value: "actions",
      },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: financialYearData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    selectedGfs: [],
    gfscodes: [],
    searchTerm: "",
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
  });

  const pullSegmentsFromPlanRep = () => {
    create();
  };

  const searchCategory = (categoryName) => {
    console.log("argument", categoryName);

    if (categoryName != null) {
      search({ code: categoryName.code }).then((response: any) => {
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

  const deleteFundingSource = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const getFunfingSources = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as FundSources;
    data.selectedGfs = [];
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as FundSources;
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
      updateFunfingSources(data.formData);
    } else {
      createFundingSource(data.formData);
    }
  };

  const loadGfsCodes = () => {
    allgfscodes({ code: "REVENUE" }).then((response: any) => {
      console.log("all gfs data", response.data.data.data);
      data.gfscodes = response.data.data.data[0].gfs_codes;
    });
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.selectedGfs = formData.gfs;
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as FundSources;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
    loadGfsCodes();
  };

  const updateFunfingSources = (data: any) => {
    update(data).then((response) => {
      console.log("Updated data", response.data);
      reloadData();
      cancelDialog();
    });
  };

  const createFundingSource = (data: any) => {
    createFundSource(data).then((response) => {
      console.log("Created data", response.data);
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

  const selectedGFS = computed(() => {
    return data.selectedGfs;
  });

  const upsert = (array, item) => {
    const idx = array.findIndex((_item: any) => _item.id === item.id);
    if (idx > -1) {
      array.splice(idx, 1);
    } else {
      array.push(item);
    }
    return array;
  };

  const onChangeList = ({ source, destination }): void => {
    const gfsCodeIds = destination.map((s) => s.id);

    destination.forEach((item) => {
      data.gfscodes = upsert(source, item);
    });
    console.log("item", gfsCodeIds);

    data.formData.gfs = gfsCodeIds;
  };

  const filterFundSource = () => {
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
    getData,
    cancelDialog,
    deleteFundingSource,
    getFunfingSources,
    updateFunfingSources,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    selectedGFS,
    onChangeList,
    pullSegmentsFromPlanRep,
    resetSearchText,
    filterFundSource,
  };
};
