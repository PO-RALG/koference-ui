import {computed, onMounted, reactive} from "@vue/composition-api";
import {AxiosResponse} from "axios";

import {OpeningBalance} from "../types/OpeningBalance";
import {Item} from "../types/items";
import {create, get} from "../services/opening.balance.service";
import {get as getBankAccounts} from "@/components/setup/bank-account/services/bank-account.service";
import {getFundingSourceList} from "@/components/receivables/receipt/services/receipt-service";

export const useOpeningBalance = (): any => {
  const dataItems: Array<OpeningBalance> = [];
  let openingBalanceData: {
    items: { funding_source_id: number; amount: number }[];
  };

  const data = reactive({
    title: "Manage Opening Balance ",
    modalTitle: "Add Opening Balance",
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "date"
      },
      {
        text: "Bank Account Name",
        align: "start",
        sortable: false,
        value: "bank_account.name",
      },
      {
        text: "Account Number",
        align: "start",
        sortable: false,
        value: "bank_account.number",
      },
      {
        text: "Legal Number",
        align: "start",
        sortable: false,
        value: "op_number"
      },
      {
        text: "Amount",
        align: "end",
        sortable: false,
        value: "amount"
      }
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: openingBalanceData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    searchTerm: "",
    bankaccounts: {},
    fundingsources: {},
  });

  onMounted(() => {
    get({per_page: 10}).then((response: AxiosResponse) => {
      const {from, to, total, current_page, per_page, last_page} =
        response.data.data;
      data.response = {from, to, total, current_page, per_page, last_page};
      data.items = response.data.data;
      data.itemsToFilter = response.data.data;
    });
    getBankAccounts({per_page: 2000}).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });
    getFundingSourceList({per_page: 2000}).then((response: AxiosResponse) => {
      data.fundingsources = response.data.data.data;
    });
  });

  const totalAmount = computed(() => {
    return data.formData.items.reduce((sum: number, item: Item) => {
      const totalAmount = item.amount ? +item.amount : 0;
      return +sum + +totalAmount;
    }, 0);
  });

  const reloadData = () => {
    get({per_page: 10}).then((response: AxiosResponse) => {
      const {from, to, total, current_page, per_page, last_page} =
        response.data.data;
      data.response = {from, to, total, current_page, per_page, last_page};
      data.items = response.data.data;
    });
    getBankAccounts({per_page: 2000}).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });
    getFundingSourceList({per_page: 2000}).then((response: AxiosResponse) => {
      data.fundingsources = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.formData = {
      items: [{funding_source_id: 1999, amount: 0.0}],
    };
    data.modal = !data.modal;
  };

  const addItem = () => {
    data.formData.items.push({
      funding_source_id: 99999,
      amount: 0.0,
    });
  };
  const removeItem = (index: number) => {
    data.formData.items.splice(index, 1);
  };
  const openDialog = () => {
    data.formData = {
      items: [{funding_source_id: 1999, amount: 0.0}],
    };
    data.modalTitle = "Add Opening Balance";

    data.modal = !data.modal;
  };

  const save = () => {
    console.log("Form Data", data.formData);
    createOpeningBalance(data.formData);
  };

  const createOpeningBalance = (data: any) => {
    create(data).then((response) => {
      console.log("Added Opening Balance", response.data.data);
      reloadData();
      cancelDialog();
    });
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data;
      data.items = response.data.data;
    });
    getBankAccounts({per_page: 2000}).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });
    getFundingSourceList({per_page: 2000}).then((response: AxiosResponse) => {
      data.fundingsources = response.data.data.data;
    });
    data.formData.items = [
      {funding_source_id: 1, amount: 0.0},
      {funding_source_id: 2, amount: 0.3},
    ];
  };

  return {
    data,
    getData,
    openDialog,
    cancelDialog,
    reloadData,
    save,
    addItem,
    removeItem,
    totalAmount,
  };
};
