import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  get,
  create,
  update,
  destroy,
  search,
  getfacility,
} from "../services/bank-account.service";
import { bankaccounttypes as getBankAccountTypes } from "@/components/setup/bank-account-type/services/bank-account-types.service";
import { BackAccount } from "../types/BackAccount";

export const useBank = (): any => {
  const dataItems: Array<BackAccount> = [];
  let BankAccounData: BackAccount;

  const data = reactive({
    title: "Manage Bank Accounts",
    modalTitle: "",
    searchTerm: "",
    searchTermFacility: "",
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
    showDeleteDialog: false,
    items: dataItems,
    filteredItems: dataItems,
    itemsToFilter: [],
    formData: BankAccounData,
    params: {
      total: 10,
      size: 10,
    },
    itemTodelete: "",
    accountTypes: [],
    filterdialog: false,

    selectedSbc: [],
    subbudgetclasses: [],
    response: {},
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
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });

    getBankAccountTypes().then((response: any) => {
      data.accountTypes = response.data.data.data;
    });
  };

  const bankName = computed(() => {
    return data.itemsToFilter.map((account) => {
      account.fullName = `Account Number -${account.number}  ${account.bank} - ${account.branch}`;
      return account;
    });
  });

  const searchBankAccounts = (categoryName) => {
    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
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
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  };

  const deleteBankAccount = (deleteId: any) => {
    data.showDeleteDialog = !data.modal;
    data.itemTodelete = deleteId;
  };

  const cancelDialog = () => {
    data.formData = {} as BackAccount;
    data.modal = !data.modal;
    data.filteredItems = [];
    data.searchTermFacility = "";
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as BackAccount;
    data.showDeleteDialog = false;
    reloadData();
  };

  const remove = () => {
    destroy(data.itemTodelete).then(() => {
      reloadData();
      data.showDeleteDialog = false;
    });
  };

  const save = () => {
    if (data.formData.id) {
      updateBankAccount(data.formData);
    } else {
      createBankAccount(data.formData);
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

  const updateBankAccount = (data: any) => {
    update(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

  const createBankAccount = (data: any) => {
    create(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

  const filterBankAccounts = () => {
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
  const filterFacility = () => {
    if (data.searchTermFacility.length >= 3) {
      getfacility({ regSearch: data.searchTermFacility }).then(
        (response: AxiosResponse) => {
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
          data.filteredItems = response.data.data.data;
        }
      );
    }
    if (data.searchTermFacility.length === 0) {
      getfacility({ per_page: 10 }).then((response: AxiosResponse) => {
        data.filteredItems = [];
      });
    }
  };

  const resetSearchFacility = () => {
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
    cancelDialog,
    deleteBankAccount,
    updateBankAccount,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchBankAccounts,
    bankName,
    filterBankAccounts,
    resetSearchText,
    filterFacility,
    resetSearchFacility,
  };
};
