import { computed, onMounted, reactive } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { BankAdjustment } from "../types/BankAdjustment";
import { Item } from "../types/items";
import { create, get, destroy } from "../services/bank.adjustment.service";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import { getFundingSourceList } from "@/components/receivables/receipt/services/receipt-service";
import stringToCurrency from "@/filters/money-to-number";

export const useBankAdjustment = (): any => {
  const dataItems: Array<BankAdjustment> = [];
  let bankAdjustmentData: {
    items: { funding_source_id: number; amount: number }[];
  };

  const data = reactive({
    title: "Manage Bank Adjustment ",
    modalTitle: "Add Bank Adjustment",
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "date",
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
        value: "ab_number",
      },
      {
        text: "Amount",
        align: "end",
        sortable: false,
        value: "amount",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: bankAdjustmentData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    searchTerm: "",
    bankaccounts: {},
    effects:[{
      "id": "plus",
      "name": "Plus(debit)"
    },{
      "id": "minus ",
      "name": "Minus(credit)"
    }
    ],
    fundingsources: {},
  });

  onMounted(() => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data;
      data.itemsToFilter = response.data.data;
    });
    getBankAccounts({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });
    getFundingSourceList({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.fundingsources = response.data.data.data;
    });
  });

  const totalAmount = computed(() => {
    return data.formData.items.reduce((sum: number, item: any) => {
      console.log("items", item);
      const totalAmount = item.amount ? +stringToCurrency(item.amount) : 0;

      return +sum + +totalAmount;
    }, 0);
  });

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data;
    });
    getBankAccounts({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });
    getFundingSourceList({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.fundingsources = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.formData = {
      items: [{ funding_source_id: 1999, amount: 0.0 }],
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
      items: [{ funding_source_id: 1999, amount: 0 }],
    };
    data.modalTitle = "Add Bank Adjustment";

    data.modal = !data.modal;
  };

  const save = () => {
    console.log("Form Data", data.formData);
    createBankAdjustment(data.formData);
  };

  const createBankAdjustment = (data: any) => {
    const items = data.items.map((entry) => ({
      ...entry,
      amount: stringToCurrency(entry.amount),
    }));
    const dataToSave = {
      ...data,
      items: items,
    };

    create(dataToSave).then((response) => {
      console.log("Added Bank Adjustment", response.data.data);
      reloadData();
      cancelDialog();
    });
  };

  const reverse = (id: number) => {
    destroy(id).then((response) => {
      console.log("reversed  Bank Adjustment", response.data.data);
      reloadData();
    });
  };

  const filterFundSource = () => {
    if (data.searchTerm.length >= 3) {
      getFundingSourceList({ regSearch: data.searchTerm }).then(
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
          data.fundingsources = response.data.data.data;
        }
      );
    }
    if (data.searchTerm.length === 0) {
      getFundingSourceList({ per_page: 10 }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.fundingsources = response.data.data.data;
      });
    }
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data;
      data.items = response.data.data;
    });
    getBankAccounts({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.bankaccounts = response.data.data.data;
    });

    getFundingSourceList({ per_page: 2000 }).then((response: AxiosResponse) => {
      data.fundingsources = response.data.data.data;
    });
    data.formData.items = [
      { funding_source_id: 1, amount: 0.0 },
      { funding_source_id: 2, amount: 0.3 },
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
    reverse,
    filterFundSource,
  };
};
