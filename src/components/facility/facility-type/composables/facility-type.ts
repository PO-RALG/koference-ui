import { AxiosResponse } from "axios";
import { FacilityType } from "../types/FacilityType";
import { reactive, watch, onMounted, computed } from "vue";

import {
  get,
  create,
  update,
  destroy,
  search,
} from "../services/facility-types.service";

export const useFacilityType = (): any => {
  const dataItems: Array<FacilityType> = [];
  let facilityTypeData: FacilityType;

  const data = reactive({
    title: "Manage Facility Types",
    valid: true,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      { text: "Code", align: "start", sortable: false, value: "code" },

      {
        text: "Cost Center",
        align: "start",
        sortable: false,
        value: "cost_center",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: facilityTypeData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
  });

  onMounted(() => {
    fetchData();
  });

  const fetchData = () => {
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
  };

  computed(() => {
    return "test";
  });

  const searchCategory = (categoryName) => {
    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
        //// data", response.data.data);
        data.items = response.data.data.data;
      });
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

  const openConfirmDialog = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };
  const getFacilityTypes = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as FacilityType;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as FacilityType;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      data.deletemodal = false;
      fetchData();
    });
  };

  const save = () => {
    if (data.formData.id) {
      updateFacilityType(data.formData);
    } else {
      createUser(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as FacilityType;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateFacilityType = (data: any) => {
    update(data).then((response) => {
      cancelDialog();
      fetchData();
    });
  };

  const createUser = (data: any) => {
    create(data).then((response) => {
      if (response.data.status === 200) {
        cancelDialog();
        fetchData();
      }
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
    openDialog,
    getData,
    cancelDialog,
    openConfirmDialog,
    getFacilityTypes,
    updateFacilityType,
    save,
    remove,
    cancelConfirmDialog,
    searchCategory,
  };
};
