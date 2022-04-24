import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import {
  get,
  create,
  update,
  deleteStatus,
} from "../services/approval-status-service";

export const useApprovalStatus = (): Record<string, unknown> => {
  const data = reactive({
    title: "Manage Approval Statuses",
    valid: true,
    isOpen: false,
    response: {},
    modalTitle: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Code", value: "code" },
      { text: "Description", value: "description" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    rows: ["5", "10", "15"],
    items: [],
    formData: {
      id: null,
      name: "",
      code: "",
      description: "",
    },
    item: null,
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    get({}).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.items = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const cancelDialog = () => {
    data.formData = {
      id: null,
      name: "",
      code: "",
      description: "",
    };
    data.modal = !data.modal;
  };

  const save = () => {
    if (data.formData.id) {
      updateStatus(data.formData);
    } else {
      createStatus(data.formData);
    }
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openDialog = (formData?) => {
    if (formData && formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateStatus = (data) => {
    update(data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const createStatus = (data: any) => {
    create(data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const openConfirmDialog = (item: any) => {
    data.item = item;
    data.isOpen = true;
  };

  const closeConfirmDialog = () => {
    data.isOpen = false;
  };

  const deleteItem = (item: number | string) => {
    const payload = item;
    deleteStatus(payload).then((response: AxiosResponse) => {
      initialize();
    });
    data.isOpen = false;
  };

  const entries = computed(() => {
    return data.items.map((item: any) => {
      return {
        ...item,
      }
    })
  });

  return {
    data,
    entries,

    openDialog,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,

    getData,

    updateStatus,
    save,
    deleteItem,
  };
};
