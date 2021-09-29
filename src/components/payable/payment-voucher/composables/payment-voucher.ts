import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { get, create, update, destroy, search } from "../services/payment-voucher.service";
import { PaymentVoucher } from "../types/PaymentVoucher";
import { get as getSupplier } from "@/components/payable/supplier/services/supplier.service"
import { get as getFinancialYear } from "@/components/setup/financial-year/services/financialyear.service"
import { get as getBankAccount } from "@/components/setup/bank-account/services/back-accounts.service"

export const usePaymentVoucher = (): any => {
  const dataItems: Array<PaymentVoucher> = [];
  const paymentVoucherData = {} as PaymentVoucher;

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
    suppliers: [],
    financialYears: [],
    bankAccounts: [],
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
      getFinancialYearData();
      getBankAccountData();
    } else {
      data.formData = {} as PaymentVoucher;
      data.modalTitle = "Create";
      data.searchTerm = "",
      getSupplierData();
      getFinancialYearData();
      getBankAccountData();
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
    getSupplier({ per_page: 10 }).then((response: AxiosResponse) => {
      data.suppliers = response.data.data.data;
    });
  };

  const searchSuppliers = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getSupplier({ per_page: 10, regSearch: regSearchTerm }).then((response: AxiosResponse) => {
      data.suppliers = response.data.data.data;
    });
  };

  const getFinancialYearData = () => {
    getFinancialYear({ per_page: 10 }).then((response: AxiosResponse) => {
      data.financialYears = response.data.data.data;
    });
  };

  const getBankAccountData = () => {
    getBankAccount({ per_page: 10 }).then((response: AxiosResponse) => {
      data.bankAccounts = response.data.data.data;
    });
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
  };
};
