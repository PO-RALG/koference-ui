import { reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { get, create, update, destroy, search } from "../services/payment-voucher.service";
import { PaymentVoucher } from "../types/PaymentVoucher";

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
    formData: paymentVoucherData,
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

  const searchItem = (itemName: PaymentVoucher) => {
    if (itemName != null) {
      search({ name: itemName.name }).then((response: AxiosResponse) => {
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
    } else {
      data.formData = {} as PaymentVoucher;
      data.modalTitle = "Create";
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
  };
};
