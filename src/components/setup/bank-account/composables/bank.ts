import { reactive, onMounted, computed } from "@vue/composition-api";

import { get, create, update, destroy, search } from "../services/bank-account.service";
import { bankaccounttypes } from "@/components/setup/bank-account-type/services/bank-account-types.service";
import { BackAccount } from "../types/BackAccount";

export const useBank = (): any => {
  const dataItems: Array<BackAccount> = [];
  let documentCategoryData: BackAccount;

  const data = reactive({
    title: "Manage Bank Accounts",
    modalTitle: "",
    headers: [
      {
        text: "GL Account",
        align: "start",
        sortable: false,
        value: "gl_account",
        width: 600,
      },
      {
        text: "Bank",
        align: "start",
        sortable: false,
        value: "bank",
      },
      {
        text: "branch",
        align: "start",
        sortable: false,
        value: "branch",
      },
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },

      {
        text: "Number",
        align: "start",
        sortable: false,
        value: "number",
      },
      {
        text: "Gfs Code",
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
    formData: documentCategoryData,
    params: {
      total: 10,
      size: 10,
    },
    itemtodelete: "",
    accounttypes: [],
    filterdialog: false,

    selectedSbc: [],
    subbudgetclasses: [],
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    // make api call
    const params: any = {
      total: 10,
      size: 10,
    };
    get(params).then((response: any) => {
      console.log("data to filter", response.data.data.data);
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
    bankaccounttypes().then((response: any) => {
      // console.log("bank account", response.data.data.data);
      data.accounttypes = response.data.data.data;
    });
  };

  const bankName = computed(() => {
    return data.itemsToFilter.map((account) => {
      account.fullName = `Account Number -${account.number}  ${account.bank} - ${account.branch}`;
      return account;
    });
  });

  const searchCategory = (categoryName) => {
    // console.log("argument", categoryName);

    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
        // console.log("response data", response);
        data.items = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    const params: any = {
      total: 10,
      size: 10,
    };
    get(params).then((response: any) => {
      // console.log("data", response.data.data);
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  };

  const deleteSubBudgetClass = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const getSubBudgetClass = () => {
    get(data).then((response) => {
      // console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as BackAccount;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as BackAccount;
    data.deletemodal = false;
    reloadData();
  };
  const cancelFilterDialog = () => {
    data.filterdialog = false;
    reloadData();
  };

  const remove = () => {
    // console.log("delete data with id", data.itemtodelete);
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    console.log("Form Data", data.formData);
    if (data.formData.id) {
      updateFinancialYear(data.formData);
    } else {
      createUser(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as BackAccount;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateFinancialYear = (data: any) => {
    update(data).then((response) => {
      // console.log("Updated data", response.data);
      reloadData();
      cancelDialog();
    });
  };

  const createUser = (data: any) => {
    create(data).then((response) => {
      // console.log("Created data", response.data);
      reloadData();
      cancelDialog();
    });
  };

  const openFilterDialog = () => {
    data.filterdialog = true;
    data.modal = false;
  };

  const resumeDialog = () => {
    data.modal = true;
    data.filterdialog = false;
  };

  const filterSbc = (term: string) => {
    const result = data.subbudgetclasses.filter((item) => item.code.toLowerCase().includes(term.toLowerCase()));
    data.subbudgetclasses = result;
    return data.subbudgetclasses;
  };

  return {
    filterSbc,
    data,
    openDialog,
    cancelDialog,
    deleteSubBudgetClass,
    getSubBudgetClass,
    updateFinancialYear,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    openFilterDialog,
    cancelFilterDialog,
    resumeDialog,
    bankName,
  };
};
