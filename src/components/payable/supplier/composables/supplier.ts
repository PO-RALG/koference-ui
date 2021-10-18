import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { get, create, update, destroy, search } from "../services/supplier.service";
import { Supplier } from "../types/Supplier";

export const useSupplier = (): any => {
  const dataItems: Array<Supplier> = [];
  const supplyData = {} as Supplier;

  const data = reactive({
    title: "Suppliers",
    valid: true,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Email",
        align: "start",
        sortable: false,
        value: "email",
      },
      {
        text: "TIN",
        align: "start",
        sortable: false,
        value: "tin",
      },
      {
        text: "Phone",
        align: "start",
        sortable: false,
        value: "phone",
      },
      {
        text: "Address",
        align: "start",
        sortable: false,
        value: "address",
      },
      {
        text: "Bank Account Name",
        align: "start",
        sortable: false,
        value: "bank_account_name",
      },
      {
        text: "Bank Account Number",
        align: "start",
        sortable: false,
        value: "bank_account_number",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: supplyData,
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
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const searchItem = (itemName: Supplier) => {
    if (itemName != null) {
      search({ name: itemName.name }).then((response: AxiosResponse) => {
        data.items = response.data.data.data;
      });
    }
  };

  const getData = (params: Supplier) => {
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
    data.formData = {} as Supplier;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as Supplier;
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
      updateSupply(data.formData);
    } else {
      createSupply(data.formData);
    }
  };

  const openDialog = (formData?: Supplier) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as Supplier;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateSupply = (data: Supplier) => {
    update(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const createSupply = (data: Supplier) => {
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
    updateSupply,
    save,
    remove,
    cancelConfirmDialog,
    searchItem,
    getData,
  };
};
