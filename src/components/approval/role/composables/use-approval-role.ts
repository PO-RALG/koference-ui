import { reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import { get, create, update, deleteRole } from "../services/approval-role-services";

export const useApprovalRole = (): any => {
  const data = reactive({
    title: "Manage Approval Roles",
    valid: true,
    isOpen: false,
    response: {},
    modalTitle: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Level", value: "level" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    rows: ["5", "10", "15"],
    items: [],
    formData: {
      id: null,
      name: "",
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
      console.log("resposne", response.data.data);
      data.items = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const cancelDialog = () => {
    data.formData = {
      id: null,
      name: "",
      description: "",
    };
    data.modal = !data.modal;
  };

  const save = () => {
    if (data.formData.id) {
      updateRole(data.formData);
    } else {
      createRole(data.formData);
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

  const updateRole = (data) => {
    update(data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const createRole = (data: any) => {
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
    deleteRole(payload).then((response: AxiosResponse) => {
      console.log(response);
      initialize();
    });
    data.isOpen = false;
  };

  const entries = computed(() => {
    return data.items.map((item: any) => {
      return {
        ...item,
        level: (item.level.name).toUpperCase(),
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

    updateRole,
    save,
    deleteItem,
  };
};
