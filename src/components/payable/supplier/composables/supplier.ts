import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";

import {
  get,
  create,
  update,
  destroy,
  search,
  activation,
} from "../services/supplier.services";
import { Supplier } from "../types/Supplier";

export const useSupplier = (): any => {
  const dataItems: Array<Supplier> = [];
  const supplyData = {} as Supplier;

  const data = reactive({
    title: "Manage Suppliers",
    valid: true,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    checkNumberError: [],
    idNumberError: [],
    bankAccNumberError:[],
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
        text: "Type",
        align: "start",
        sortable: false,
        value: "supplier_type",
      },
      {
        text: "Bank Name",
        align: "start",
        sortable: false,
        value: "bank_name",
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
        text: "Activation",
        align: "start",
        sortable: false,
        value: "activations",
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
    focus: false,
    supplierTypes: ["Contractor/Supplier", "Employee", "Others"],
    phoneRules: [
      (v: string) => !!v || "Phone number is required",
      (v: string) =>
        (v && v.length === 12) || "Phone number must be 1 characters",
      (v: string) =>
        /^0[0-9].*$/.test(v) || "Phone number must start with zero (0)",
    ],
    tinRules: [
      (v: string) => !!v || "TIN is required",
      (v: string) =>
        /^[\d]{3}-[\d]{3}-[\d]{3}$/.test(v) ||
        "TIN must be valid. e.g 000-111-222",
    ],
    checkRules: [
      (v: string) => !!v || "Number is required",
      (v: string) =>
        (v && v.length <= 10) || "Number must be less than 10 characters",
      
    ],
    nameRules: [(v: string) => !!v || "Name is required"],
    typeRules: [(v: string) => !!v || "Type is required"],
    idRules: [(v: string) => !!v || "ID is required"],
    bankRules: [(v: string) => !!v || "Bank Name is required"],
    bankAccountNameRules: [
      (v: string) => !!v || "Bank Account Name is required",
    ],
    bankAccountNumberRules: [
      (v: string) => !!v || "Bank Account Number is required",
    ],
    bankAddressNumberRules: [(v: string) => !!v || "Adress is required"],
  });

  onMounted(() => {
    getTableData();
  });

  const filterSupplier = () => {
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

  const getTableData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
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
      updateSupplier(data.formData);
    } else {
      createSupplier(data.formData);
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

  const updateSupplier = (data: Supplier) => {
    update(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const createSupplier = (data: Supplier) => {
    create(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const setActivation = (item: string) => {
    activation(item).then(() => {
      getTableData();
    });
  };

  const checkNumberValidate = () => {
    return (v: string) => {
      if (!v) {
        return !!v || `Check number is required`;
      }else if (v && v.length <= 10){
        return(v && v.length <= 10) || "Number must be less than 10 characters"
      } 
    } 
  };

  const uniqueCheckNumber =  async (input:string) => {
    if (input.length > 3 && data.modalTitle === "Create") {
      const res=  await search({check_number: input});
      const result = res.data.data;
      if ((result.data.length > 0) && (result.data.find(x =>x.check_number ===input) !== undefined)) {
        data.checkNumberError = ["Check number already exist"];
      }else{
        data.checkNumberError = [];
      }
    }else{
      data.checkNumberError = [];
    }
  };

  const uniqueIdNumber =  async (input:string) => {
    if (input.length > 3 && data.modalTitle === "Create") {
      const res=  await search({id_number: input});
      const result = res.data.data;
      if ((result.data.length > 0) && (result.data.find(x =>x.id_number ===input) !== undefined)) {
        data.idNumberError = ["ID number already exist"];
      }else{
        data.idNumberError = [];
      }
    }else{
      data.idNumberError = [];
    }
  };

  const uniqueBankAccNumber =  async (input:string) => {
    if (input.length > 3 && data.modalTitle === "Create") {
      const res=  await search({bank_account_number: input});
      const result = res.data.data;
      if ((result.data.length > 0) && (result.data.find(x =>x.bank_account_number ===input) !== undefined)) {
        data.bankAccNumberError = ["Account number already exist"];
      }else{
        data.bankAccNumberError = [];
      }
    }else{
      data.bankAccNumberError = [];
    }
  };

  return {
    data,
    openDialog,
    cancelDialog,
    openConfirmDialog,
    updateSupplier,
    save,
    remove,
    cancelConfirmDialog,
    searchItem,
    getData,
    setActivation,
    filterSupplier,
    resetSearchText,
    checkNumberValidate,
    uniqueCheckNumber,
    uniqueIdNumber,
    uniqueBankAccNumber,
  };
};
