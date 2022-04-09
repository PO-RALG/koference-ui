import { AxiosResponse } from "axios";
import { FundSources } from "../types";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import { reactive, onMounted, computed } from "@vue/composition-api";
import {
  get,
  create,
  update,
  destroy,
  search,
} from "../services/funding-sources";

export const useFundSource = (): any => {
  const dataItems: Array<FundSources> = [];
  let financialYearData: FundSources;

  const data = reactive({
    title: "Manage Funding Sources",
    modalTitle: "",
    headers: [
      {
        text: "Funding Sources Code",
        align: "start",
        sortable: false,
        value: "code",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      { text: "Actions", value: "actions", sortable: false },
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
    console.log("Form Data", data.formData);

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
    create(data).then((response) => {
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
    destination.forEach((item) => {
      data.gfscodes = upsert(source, item);
    });
    data.formData.gfscodes = destination;
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
  };
};
