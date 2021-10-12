import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { get, create, update, destroy, search, fundByActivity, fundByActivityFundSource } from "../services/payment-voucher.service";
import { PaymentVoucher } from "../types/PaymentVoucher";
import { get as getSupplier } from "@/components/payable/supplier/services/supplier.service"
import { get as getActivity } from "@/components/planning/activity/services/activity.service"
import { getBudget } from "@/components/payable/fund-allocation/services/fund-allocation.service"
import { Activity } from "@/components/planning/activity/types/Activity";
import { FundSources } from "@/components/coa/funding-source/types/index";

export const usePaymentVoucher = (): any => {
  const dataItems: Array<PaymentVoucher> = [];
  const paymentVoucherData = {} as PaymentVoucher;
  const activityItem = {} as Activity;
  const fundSourceItem = {} as FundSources;

  const data = reactive({
    title: "Payment Vouchers",
    valid: true,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "date",
      },
      {
        text: "Reference Number",
        align: "start",
        sortable: false,
        value: "reference_no",
      },
      {
        text: "Supplier",
        align: "start",
        sortable: false,
        value: "supplier.name",
      },
      {
        text: "Bank Account",
        align: "start",
        sortable: false,
        value: "bank_account",
      },
      {
        text: "Financial Year",
        align: "start",
        sortable: false,
        value: "financial_year.name",
      },
      {
        text: "Amount",
        align: "start",
        sortable: false,
        value: "amount",
      },
      {
        text: "Amount Paid",
        align: "start",
        sortable: false,
        value: "amount_paid",
      },
      {
        text: "Full Paid",
        align: "start",
        sortable: false,
        value: "full_paid",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
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
    formData: paymentVoucherData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    searchTerm: "",
    activityItem: activityItem,
    fundSourceItem: fundSourceItem,
    suppliers: [],
    activities: [],
    gfsCodes: [],
    fundingSources: [],
    accounts: [],
    payables: [{funding_source_id:'',gfs_code_id:'',amount:'',}],
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

  const searchItem = (itemName: PaymentVoucher) => {
    if (itemName != null) {
      search({ reference_no: itemName.reference_no }).then((response: AxiosResponse) => {
        data.items = response.data.data.data;
      });
    }
  };

  const getData = (params: PaymentVoucher) => {
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
    data.formData = {} as PaymentVoucher;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as PaymentVoucher;
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
      updateActivity(data.formData);
    } else {
      createActivity(data.formData);
    }
  };

  const openDialog = (formData?: PaymentVoucher) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
      data.searchTerm = "",
      getSupplierData();
      getActivityData();
    } else {
      data.formData = {} as PaymentVoucher;
      data.modalTitle = "Create";
      data.searchTerm = "",
      getSupplierData();
      getActivityData();
    }
    data.modal = !data.modal;
  };

  const updateActivity = (data: PaymentVoucher) => {
    update(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const createActivity = (data: PaymentVoucher) => {
    create(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const getSupplierData = () => {
    getSupplier({ per_page: 10 }).then(
      (response: AxiosResponse) => {
        data.suppliers = response.data.data.data;
      }
    );
  };

  const searchSuppliers = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getSupplier({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        data.suppliers = response.data.data.data;
      }
    );
  };

  const getActivityData = () => {
    getActivity({ per_page: 10 }).then((response: AxiosResponse) => {
      data.activities = response.data.data.data;
    });
  };

  const searchActivities = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getActivity({ per_page: 10, regSearch: regSearchTerm }).then(
      (response: AxiosResponse) => {
        data.activities = response.data.data.data;
      }
    );
  };

  const searchGfsCodes = (fund: FundSources) => {
    data.fundSourceItem = fund;
    console.log(data.fundSourceItem)
    fundByActivityFundSource(data.activityItem.id,data.fundSourceItem.id).then(
      (response: AxiosResponse) => {
        data.gfsCodes = response.data.data;
      }
    );
    getBudget({ activity_code: data.activityItem.code, fund_code: data.fundSourceItem.code }).then((response: AxiosResponse) => {
      data.accounts = response.data.data;
    });
  };

  const searchFundingSource = (item: Activity) => {
    data.activityItem = item
    fundByActivity(item.id).then(
      (response: AxiosResponse) => {
        data.fundingSources = response.data.data;
      }
    );
    getBudget({ activity_code: item.code }).then((response: AxiosResponse) => {
      data.accounts = response.data.data;
    });
  };


  const addPayable = () => {
    data.payables.push({ funding_source_id: "", gfs_code_id: "", amount: "" });
  };

  const removePayable = (index: number) => {
    data.payables.splice(index, 1);
  };

  return {
    data,
    openDialog,
    cancelDialog,
    openConfirmDialog,
    updateActivity,
    save,
    remove,
    cancelConfirmDialog,
    searchItem,
    getData,
    searchSuppliers,
    addPayable,
    removePayable,
    searchActivities,
    searchGfsCodes,
    searchFundingSource,
  };
};
