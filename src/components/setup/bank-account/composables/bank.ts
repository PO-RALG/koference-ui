import { reactive, onMounted, computed } from "@vue/composition-api";

import {
  get,
  create,
  update,
  destroy,
  search,
} from "../services/bank-account.service";
import { bankaccounttypes as getBankAccountTypes } from "@/components/setup/bank-account-type/services/bank-account-types.service";
import { BackAccount } from "../types/BackAccount";

export const useBank = (): any => {
  const dataItems: Array<BackAccount> = [];
  let BankAccounData: BackAccount;

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
    showDeleteDialog: false,
    items: dataItems,
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
  };
};
