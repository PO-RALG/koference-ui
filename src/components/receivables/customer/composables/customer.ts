import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { Customer } from "../types/Customer";
import {
  get,
  create,
  update,
  destroy,
  regSearch,
  activation,
  getTrushed,
  restoreCustomer,
} from "../services/customer.service";
import { search as listOfGenericCustomer } from "../../../receivables/generic-customer/services/generic.customer.service";

export const useCustomer = (): any => {
  const dataItems: Array<Customer> = [];
  let customerData: Customer;

  const data = reactive({
    title: "Manage Customers",
    searchTerm: "",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      { text: "Email", align: "start", sortable: false, value: "email" },

      { text: "Address", align: "start", sortable: false, value: "address" },
      { text: "Phone", align: "start", sortable: false, value: "phone" },
      { text: "Activation", value: "activations", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    headersTrash: [
      {
        text: "No",
        align: "start",
        sortable: false,
        value: "index",
      },
      { text: "Name", align: "start", sortable: false, value: "name" },
      { text: "Email", align: "start", sortable: false, value: "email" },

      { text: "Address", align: "start", sortable: false, value: "address" },
      { text: "Phone", align: "start", sortable: false, value: "phone" },
      { text: "Activation", value: "activations", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    trushModal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: customerData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    restoreId: "",
    response: {},
    addcustomer: false,
    genericCustomer: [],
    itemsDeleted: [],
    restoreTrashedmodal: false,
  });

  onMounted(() => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  });

  const filterCustomers = () => {
    if (data.searchTerm.length > 3) {
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
    if (data.searchTerm.length === 0 || data.searchTerm === null) {
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

  const resetSearchText = () => {
    data.searchTerm = "";
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const setActivation = (item) => {
    activation(item).then((response: any) => {
      console.log("activated data", response.data);
      reloadData();
    });
  };

  const trushedNew = computed(() => {
    return data.itemsDeleted
      .map((trashed: any) => ({
        ...trashed,
      }))
      .sort(function (a, b) {
        if (a > b) return 1;
        return -1;
      })
      .map((item, index) => ({
        ...item,
        index: ++index,
      }));
  });

  const isUpdate = computed(() => {
    return data.modalTitle == "Update" ? true : false;
  });

  const searchCategory = (categoryName) => {
    console.log("argument", categoryName);

    if (categoryName != null) {
      regSearch({ name: categoryName.name }).then((response: any) => {
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

    getTrushed({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.itemsDeleted = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  };

  const deleteCustomer = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const openRestoreTrashedDialog = (restoreId: any) => {
    data.restoreTrashedmodal = !data.modal;
    data.restoreId = restoreId;
  };
  const getCustomer = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as Customer;
    data.modal = !data.modal;
    data.addcustomer = false;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as Customer;
    data.deletemodal = false;
    data.trushModal = false;
  };

  const cancelRestoreDialog = () => {
    data.restoreTrashedmodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const restore = () => {
    restoreCustomer(data.restoreId).then(() => {
      reloadData();
      data.restoreTrashedmodal = false;
    });
  };

  const save = () => {
    console.log("Form Data", data.formData);
    if (data.formData.id && isUpdate.value) {
      updatecustomer(data.formData);
    } else {
      delete data.formData.id;
      createCustomer(data.formData);
    }
  };

  const openTrushedDialog = () => {
    getTrushed({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.itemsDeleted = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
    data.trushModal = !data.modal;
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as Customer;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;

    listOfGenericCustomer({ per_page: 1000, active: true }).then(
      (response: AxiosResponse) => {
        data.genericCustomer = response.data.data.data;
      }
    );
  };

  const updatecustomer = (data: any) => {
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
  const setAddCostomerValue = () => {
    data.addcustomer = true;
    data.formData = {} as Customer;
  };
  const setGenericValue = () => {
    data.addcustomer = false;
    data.formData = {} as Customer;
  };
  const populateFormData = (event: any) => {
    data.formData = event;
  };

  return {
    data,
    getData,
    openDialog,
    cancelDialog,
    deleteCustomer,
    openRestoreTrashedDialog,
    getCustomer,
    updatecustomer,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    setActivation,
    setAddCostomerValue,
    setGenericValue,
    populateFormData,
    filterCustomers,
    resetSearchText,
    isUpdate,
    openTrushedDialog,
    cancelRestoreDialog,
    restore,
    trushedNew,
  };
};
