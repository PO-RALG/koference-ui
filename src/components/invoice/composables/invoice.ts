import { AxiosResponse } from "axios";
import { reactive, onMounted } from "@vue/composition-api";

import { ManageInvoice } from "../types";
import { get, create, update, destroy, search, viewinvoice } from "../services/invoice";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import { customers } from "@/components/setup/customer/services/customer.service";
import { itemdefinitions } from "@/components/setup/invoice-item-definition/services/invoice-item-definition";

export const useInvoice = (): any => {
  const dataItems: Array<ManageInvoice> = [];
  let customerData: ManageInvoice;

  const data = reactive({
    title: "Manage Invoice",
    modalTitle: "",
    headers: [
      {
        text: "Invoice Number",
        align: "start",
        sortable: false,
        value: "invoice_number",
      },
      {
        text: "Customer",
        align: "start",
        sortable: false,
        value: "customer.name",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },

      {
        text: "Ammount",
        align: "start",
        sortable: false,
        value: "amount",
      },
      { text: "Date", value: "date", sortable: true },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    invoicedetails: false,
    items: dataItems,
    itemsToFilter: [],
    formData: customerData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    gfscodes: [],
    customers: [],
    itemdefinitions: [],
    invoicedata: [],
    invoice_items: [
      {
        invoice_item_definition_id: "",
        amount: "",
      },
    ],
    loading: false,
    coat: "/coat_of_arms.svg.png",
  });

  onMounted(() => {
    data.loading = true;
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
      data.loading = false;
    });

    allgfscodes({ per_page: 2000 }).then((response: any) => {
      data.gfscodes = response.data.data.data;
    });

    customers({ per_page: 2000 }).then((response: any) => {
      data.customers = response.data.data.data;
    });

    itemdefinitions({ per_page: 2000 }).then((response: any) => {
      data.itemdefinitions = response.data.data.data;
    });
  });

  const searchCategory = (categoryName) => {
    if (categoryName != null) {
      search({ invoice_number: categoryName.invoice_number }).then((response: any) => {
        data.items = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const deleteInvoiceItemdefinition = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
  };

  const getInvoiceItemdefinition = () => {
    get(data).then(() => {});
  };

  const cancelDialog = () => {
    data.formData = {} as ManageInvoice;
    (data.invoice_items = [
      {
        invoice_item_definition_id: "",
        amount: "",
      },
    ]),
      (data.modal = !data.modal);
  };
  const cancelInvoiceDialog = () => {
    data.invoicedetails = false;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as ManageInvoice;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    data.formData.items = data.invoice_items;
    if (data.formData.id) {
      updateInvoiceItemDefinition(data.formData);
    } else {
      createCustomer(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as ManageInvoice;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateInvoiceItemDefinition = (data: any) => {
    update(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const createCustomer = (data: any) => {
    create(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const addRow = () => {
    data.invoice_items.push({
      invoice_item_definition_id: "",
      amount: "",
    });
  };

  const removeRow = (index: any) => {
    data.invoice_items.splice(index, 1);
  };

  const previewInvoice = (item: number) => {
    viewinvoice(item).then((response: AxiosResponse) => {
      data.invoicedata = response.data.data;
      data.invoicedetails = true;
    });
  };

  return {
    data,
    getData,
    addRow,
    removeRow,
    openDialog,
    cancelDialog,
    deleteInvoiceItemdefinition,
    getInvoiceItemdefinition,
    updateInvoiceItemDefinition,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    previewInvoice,
    cancelInvoiceDialog,
  };
};
