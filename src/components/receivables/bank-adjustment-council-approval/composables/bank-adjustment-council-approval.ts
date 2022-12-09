import { computed, onMounted, reactive } from "vue";
import { AxiosResponse } from "axios";

import { BankAdjustment } from "../types/BankAdjustment";
import { Item } from "../types/items";
import {
  create,
  get,
  getPendingApproveCouncil,
  destroy,
  approveBACouncilService,
} from "../services/bank.adjustmentcouncilapproval.service";
import { get as getBankAccounts } from "@/components/setup/bank-account/services/bank-account.service";
import { getAdjustmentAccount as getGlAccounts } from "@/components/general-ledger/gl-account/services/gl.account.service";
import { getFundingSourceList } from "@/components/receivables/receipt/services/receipt-service";
import stringToCurrency from "@/filters/money-to-number";
import GLAccount from "@/components/general-ledger/gl-account/GLAccount.vue";
import { BankAdjustmentPayload } from "../types/BankAdjustment";
export const useBankAdjustmentCouncilApprove = (): any => {
  const dataItems: Array<BankAdjustment> = [];
  let bankAdjustmentData: {
    items: { funding_source_id: number; amount: number }[];
  };
  const bankAdjustmentData2 = {} as BankAdjustmentPayload;

  const data = reactive({
    title: "Bank Adjustment",
    valid: true,
    modalTitle: "Add Bank Adjustment",
    itemsx: [
      { header: "Today" },
      {
        title: "GL ACCOUNT?",
        subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
      },
      {
        title: "Ammount?",
        subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
      },
      { divider: true, inset: true },
    ],
    validate: {
      rejectionReason: [
        (v) => !!v || "Put a reason for jection of this adjustment",
      ],
    },
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
        value: "ba_number",
      },
      {
        text: "Amount",
        align: "end",
        sortable: false,
        value: "amount",
      },
      {
        text: "Approve Status",
        align: "start",
        sortable: false,
        value: "approve",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: bankAdjustmentData,
    formData2: bankAdjustmentData2,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    searchTerm: "",
    bankaccounts: {},
    glAccounts: {},
    effects: [
      {
        id: "plus",
        name: "Plus(debit)",
      },
      {
        id: "minus ",
        name: "Minus(credit)",
      },
    ],
    fundingsources: {},
    genericDialogAction: null,
    genericConfirmModel: false,
    previewBAModal: false,
    genericrejectConfirmModel: false,
    formDataBARejectionComment: "",
  });

  onMounted(() => {
    getPendingApproveCouncil({ per_page: 10 }).then(
      (response: AxiosResponse) => {
        console.log("response.data.data", response.data.data);
        if (response.data.data) {
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
          data.items = response.data.data.data.map((approve: any) => ({
            ...approve,
            approve: approve.approves.find(
              (flow) => flow.workflow == "BANK_ADJUSTMENT"
            ),
          }));
          data.itemsToFilter = response.data.data.data;
        } else {
          data.items = [];
        }
      }
    );
  });

  const cancelGenericConfirmDialog = () => {
    data.genericConfirmModel = false;
    data.previewBAModal = false;
    data.genericrejectConfirmModel = false;
  };

  const rejectApproveCouncil = (model: any) => {
    data.formData2 = model;
    data.modalTitle = "Reject Bank Adjustment";
    data.genericDialogAction = rejectBACouncilComplete;
    data.genericrejectConfirmModel = true;
  };

  const rejectBACouncilComplete = () => {
    if (
      typeof data.formData2.approves == "undefined" ||
      data.formData2.approves.length === 0
    ) {
      return false;
    }
    let currentFlowable = null;
    const approves = data.formData2.approves;

    approves.forEach(function (flowable) {
      if (flowable.facility_appoved == null) {
        currentFlowable = flowable;
      }
    });
    if (currentFlowable == null) {
      return false;
    }
    const approveData = {
      approval: currentFlowable,
      rejection_reason: data.formDataBARejectionComment,
      approved: false,
    };
    approveBACouncilService(approveData).then(() => {
      data.genericrejectConfirmModel = false;
      reloadData();
    });
  };

  const approveBACouncil = (model: any) => {
    data.formData2 = model;
    data.modalTitle = "Approve Bank Adjustment";
    data.genericDialogAction = approveBACouncilComplete;
    data.genericConfirmModel = true;
  };

  const approveBACouncilComplete = () => {
    if (
      typeof data.formData2.approves == "undefined" ||
      data.formData2.approves.length === 0
    ) {
      return false;
    }
    let currentFlowable = null;
    const approves = data.formData2.approves;

    approves.forEach(function (flowable) {
      if (flowable.facility_appoved == null) {
        currentFlowable = flowable;
      }
    });
    if (currentFlowable == null) {
      return false;
    }
    const approveData = {
      approval: currentFlowable,
      approved: true,
    };
    approveBACouncilService(approveData).then(() => {
      data.genericConfirmModel = false;
      reloadData();
    });
  };

  const totalAmount = computed(() => {
    return data.formData.items.reduce((sum: number, item: any) => {
      console.log("items", item);
      const totalAmount = item.amount ? +stringToCurrency(item.amount) : 0;

      return +sum + +totalAmount;
    }, 0);
  });

  const reloadData = () => {
    getPendingApproveCouncil({ per_page: 10 }).then(
      (response: AxiosResponse) => {
        response.data.data;
        if (response.data.data) {
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
          data.items = response.data.data.data.map((approve: any) => ({
            ...approve,
            approve: approve.approves.find(
              (flow) => flow.workflow == "BANK_ADJUSTMENT"
            ),
          }));
          data.itemsToFilter = response.data.data.data;
        } else {
          data.items = [];
        }
        data.itemsToFilter = response.data.data.data;
      }
    );
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
    const items = data.items;
    /* const items = data.items?.map((entry) => ({
      ...entry,
      amount: stringToCurrency(entry.amount),
    }));*/
    const dataToSave = {
      ...data,
      amount: data.amount,
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
    getPendingApproveCouncil({ per_page: 10 }).then(
      (response: AxiosResponse) => {
        console.log("response.data.data", response.data.data);
        if (response.data.data) {
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
          data.items = response.data.data.data.map((approve: any) => ({
            ...approve,
            approve: approve.approves.find(
              (flow) => flow.workflow == "BANK_ADJUSTMENT"
            ),
          }));
          data.itemsToFilter = response.data.data.data;
        } else {
          data.items = [];
        }
      }
    );

    data.formData.items = [
      { funding_source_id: 1, amount: 0.0 },
      { funding_source_id: 2, amount: 0.3 },
    ];
  };

  const filterGLAccounts = () => {
    if (data.searchTerm.length >= 3) {
      getGlAccounts({ regSearch: data.searchTerm }).then(
        (response: AxiosResponse) => {
          data.glAccounts = response.data.data.data;
        }
      );
    }
    if (data.searchTerm.length === 0) {
      getGlAccounts({ per_page: 200 }).then((response: AxiosResponse) => {
        data.glAccounts = response.data.data.data;
      });
    }
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
    filterGLAccounts,
    approveBACouncil,
    cancelGenericConfirmDialog,
    rejectApproveCouncil,
  };
};
