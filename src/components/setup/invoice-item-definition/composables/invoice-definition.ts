import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  get,
  create,
  update,
  destroy,
  search,
  activation,
} from "../services/invoice-item-definition";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import { fundingsources } from "@/components/coa/funding-source/services/funding-sources";
import { ManageInvoiceItemDefinition } from "../types/";

export const useInvoiceDefinition = (): any => {
  const dataItems: Array<ManageInvoiceItemDefinition> = [];
  let customerData: ManageInvoiceItemDefinition;

  const data = reactive({
    title: "Manage Invoice Item Definition",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      {
        text: "Unit of Measure",
        align: "start",
        sortable: false,
        value: "unit_of_measure",
      },
      { text: "Code", align: "start", sortable: false, value: "code" },

      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      { text: "Fund Source", value: "fund_source.code", sortable: true },
      { text: "Gfs Code", value: "gfs_code.code", sortable: true },
      { text: "Activation", value: "activations", sortable: false },
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
    fundingsources: [],
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

    allgfscodes({ name: "Revenue" }).then((response: any) => {
      console.log("all gfs data", response.data.data.data);
      data.gfscodes = response.data.data.data;
    });

    fundingsources({ per_page: 2000 }).then((response: any) => {
      data.fundingsources = response.data.data.data;
    });
  };

  const gfsName = computed(() => {
    return data.gfscodes.map((gfsItem) => {
      gfsItem.fullName = `${gfsItem.code} - ${gfsItem.name} `;
      return gfsItem;
    });
  });

  const fundingsourceName = computed(() => {
    return data.fundingsources.map((fundingsourceItem) => {
      fundingsourceItem.sourceName = `${fundingsourceItem.code} - ${fundingsourceItem.description} `;
      return fundingsourceItem;
    });
  });

  const setActivation = (item) => {
    activation(item).then((response: any) => {
      console.log("activated data", response.data);
      reloadData();
    });
  };

  const searchCategory = (categoryName) => {
    console.log("argument", categoryName);

    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
        console.log("response data", response.data.data);
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

  const deleteInvoiceItemdefinition = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const getInvoiceItemdefinition = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as ManageInvoiceItemDefinition;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as ManageInvoiceItemDefinition;
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
      updateInvoiceItemDefinition(data.formData);
    } else {
      createCustomer(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as ManageInvoiceItemDefinition;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateInvoiceItemDefinition = (data: any) => {
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
    deleteInvoiceItemdefinition,
    getInvoiceItemdefinition,
    updateInvoiceItemDefinition,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    setActivation,
    gfsName,
    fundingsourceName,
  };
};
