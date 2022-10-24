import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";
import router from "@/router";

import { get, create, update, deleteRole } from "../services/role-services";
import { get as getLevels } from "@/components/admin-area/level/services/level-services";
import { Role } from "../types/Role";
import { Level } from "@/components/admin-area/level/types/Level";

export const useRole = (): any => {
  const dataItems: Array<Role> = [];
  const levelItems: Array<Level> = [];
  const roleData = {} as Role;
  const data = reactive({
    title: "Manage Roles",
    valid: true,
    isOpen: false,
    item: roleData,
    response: {},
    modalTitle: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Display Name", align: "start", sortable: false, value: "display_name" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    items: dataItems,
    formData: roleData,
    rows: ["5", "10", "15"],
    levels: levelItems,
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
    loadLevels();
  };

  const cancelDialog = () => {
    data.formData = {} as Role;
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

  const openDialog = (formData?: Role) => {
    if (formData && formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateRole = (data: Role) => {
    update(data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const navigateToAddPermissions = (item: any) => {
    router.push({ path: `/manage-roles/${item.id}/add-permissions` });
  };

  const createRole = (data: Role) => {
    create(data).then((response) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    })
  };

  const openConfirmDialog = (item: Role) => {
    data.item = item;
    data.isOpen = true;
  };

  const closeConfirmDialog = () => {
    data.item = {} as Role;
    data.isOpen = false;
  };

  const deleteItem = (id: number | string) => {
    deleteRole(id).then((response: AxiosResponse) => {
      initialize();
    });
    data.item = {} as Role;
    data.isOpen = false;
  };

  const loadLevels = () => {
    getLevels({}).then((response: AxiosResponse) => {
      data.levels = response.data.data.data;
    });
  };

  return {
    data,

    openDialog,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,

    getData,
    loadLevels,
    navigateToAddPermissions,

    updateRole,
    save,
    deleteItem,
  };
};
