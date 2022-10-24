import { reactive, onMounted, computed } from "vue";
import { AxiosResponse } from "axios";

import { GenericCustomer } from "../types/GenericCustomer";
import {
  get,
  create,
  update,
  destroy,
  search,
  activation,
} from "../services/generic.customer.service";

export const useGenericCustomer = (): any => {
  const dataItems: Array<GenericCustomer> = [];
  let genericCustomerData: GenericCustomer;

  const data = reactive({
    title: "Manage Generic Customers",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      { text: "Email", align: "start", sortable: false, value: "email" },

      { text: "Address", align: "start", sortable: false, value: "address" },
      { text: "Phone", align: "start", sortable: false, value: "phone" },
      { text: "Activation", value: "activations", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: genericCustomerData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    searchTerm: "",
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

  const setActivation = (item) => {
    activation(item).then((response: any) => {
      console.log("activated data", response.data);
      reloadData();
    });
  };

  computed(() => {
    return "test";
  });

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

  const deleteCustomer = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };
  const getCustomer = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as GenericCustomer;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as GenericCustomer;
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
      updatecustomer(data.formData);
    } else {
      createCustomer(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as GenericCustomer;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
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

  const filterGenericCustomer = () => {
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
    getData,
    openDialog,
    cancelDialog,
    deleteCustomer,
    getCustomer,
    updatecustomer,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    setActivation,
    filterGenericCustomer,
    resetSearchText,
  };
};
