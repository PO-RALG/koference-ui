import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { BanckAccountType } from "../types";
import {
  get,
  create,
  update,
  destroy,
  search,
} from "../services/bank-account-types.service";
import { useGfsCode } from "@/components/coa/gfs-code/composables/gfs-code";

export const useBankAccountType = (): any => {
  const dataItems: Array<BanckAccountType> = [];
  let customerData: BanckAccountType;
  const { getGfsCodes } = useGfsCode();

  const data = reactive({
    title: "Manage Bank Account Types",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      {
        text: "Gfs code",
        align: "start",
        sortable: false,
        value: "gfs_code.name",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: customerData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    gfscodes: [],
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  };

  const searchCategory = (categoryName: any) => {
    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
        //// data", response.data.data);
        data.items = response.data.data;
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

  const deleteBankAccountType = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const cancelDialog = () => {
    data.formData = {} as BanckAccountType;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as BanckAccountType;
    data.deletemodal = false;
  };

  const remove = () => {
    console.log("delete data with id", data.itemtodelete);
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    console.log("Form Data", data.formData);
    if (data.formData.id) {
      updateCustomer(data.formData);
    } else {
      createCustomer(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    loadGfsCodes();

    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as BanckAccountType;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const loadGfsCodes = () => {
    getGfsCodes({ per_page: 500 }).then((response: AxiosResponse) => {
      data.gfscodes = response.data.data;
    });
  };

  const gfsCodes = computed(() => {
    return data.gfscodes.map((gfs) => {
      gfs.fullName = `(${gfs.code}) - ${gfs.name}`;
      return gfs;
    });
  });

  const updateCustomer = (data: any) => {
    update(data).then((response) => {
      console.log("Updated data", response.data);
      reloadData();
      cancelDialog();
    });
  };

  const createCustomer = (data: any) => {
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

  return {
    data,
    getData,
    openDialog,
    cancelDialog,
    deleteBankAccountType,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    gfsCodes,
  };
};
