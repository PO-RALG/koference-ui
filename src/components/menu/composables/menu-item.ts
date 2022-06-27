import { onMounted, reactive, watch, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import {
  get,
  create,
  update,
  deleteEntry,
  find,
  getResourceCategories,
  getPermissionsByResource,
  addPermissions as assignPermissions,
} from "../services/menu.service";

import { MenuItem } from "../types/MenuItem";

export const useMenuItems = (): any => {
  const TYPE = "MENU_ITEM";
  const TABLE_ROWS = ["10", "20", "30", "40", "50", "100"];
  const dataItems: Array<MenuItem> = [];
  const menuItemData = {} as MenuItem;

  const data = reactive({
    title: "Manage Menu Items",
    valid: true,
    isOpen: false,
    permissionDialog: false,
    item: menuItemData,
    menuGroups: [],
    response: {},
    modalTitle: "",
    modal: false,
    items: dataItems,
    formData: menuItemData,
    rows: ["10", "20", "30", "40", "50", "100"],
    // properties for permission dialog
    menu: null,
    loading: false,
    categories: [],
    category: null,
    selected: [],
    selectedCategory: "",
    categoryOptions: [],
  });

  // search by these fields
  const filters = {
    name: "",
    state: "",
    url: "",
    icon: "",
    auth_menu_group_id: null,
    code: "",
  };

  const HEADERS = [
    { text: "Icon", value: "icon" },
    { text: "Name", value: "name" },
    { text: "Code", value: "code" },
    { text: "State", value: "state" },
    { text: "Menu Group", value: "group" },
    { text: "Actions", value: "actions", sortable: false },
  ];

  const TITLE = "Manage Menu Items";

  const initialize = () => {
    get(TYPE, { per_page: 100, search: { filters } }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.items = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  onMounted(() => {
    initialize();
  });

  const cancelDialog = () => {
    data.formData = {} as MenuItem;
    data.modal = !data.modal;
  };

  const updateMenuItem = (data: any) => {
    update(TYPE, data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const createMenuItem = (data: MenuItem) => {
    create(TYPE, data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const selectedCategory = computed(() => {
    return data.selectedCategory;
  });

  const getData = (params: any) => {
    data.response = params;
    get(TYPE, params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openConfirmDialog = (item: MenuItem) => {
    data.item = item;
    data.isOpen = true;
  };

  const closeConfirmDialog = () => {
    data.item = {} as MenuItem;
    data.isOpen = false;
  };

  const deleteItem = (item: number | string) => {
    const payload = item;
    deleteEntry(TYPE, payload).then((response: AxiosResponse) => {
      console.log(response);
      initialize();
    });
    data.item = {} as MenuItem;
    data.isOpen = false;
  };

  const addPermissions = () => {
    const payload = {
      menu_id: data.menu.id,
      permissions: data.selected.map((val) => val.id),
    };

    assignPermissions(payload).then((response: AxiosResponse) => {
      if (response.status == 200) {
        data.permissionDialog = false;
      }
    });
  };

  const openPermissionDialog = (item) => {
    data.menu = item;
    data.permissionDialog = true;

    const menuID: number | string = item.id;
    find(menuID, TYPE).then((response: AxiosResponse) => {
      data.menu = response.data.data;
      data.selected = response.data.data.permisions;
      response.data.data.permisions.length > 0
        ? (data.selectedCategory = response.data.data.permisions[0].resource)
        : (data.selectedCategory = "");
    });

    getResourceCategories({ categories: true }).then((response: AxiosResponse) => {
      data.categories = response.data.data;
      data.categoryOptions = response.data.data.map((entry) => {
        return entry.category;
      });
    });
  };

  const openDialog = (formData?: MenuItem) => {
    if (formData && formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
    get("MENU_GROUP", {}).then((response: AxiosResponse) => {
      data.menuGroups = response.data.data.data;
    });
  };

  const categories = computed(() => {
    return data.categories;
  });

  watch([selectedCategory, data.categories], (newValue) => {
    const [selected] = newValue;
    if (data.categories.length > 0 && !!selected) {
      const { id, category } = data.categories.find((c) => c.category == selected);
      data.selectedCategory = category;
      getPermissionsByResource(id, category).then((response) => {
        data.category = response.data.data;
      });
    }
  });

  const items = computed(() => {
    return data.items.map((item: any) => ({
      ...item,
      group: item.group ? `[ ${item.group.name} ]` : ["NO GROUP"],
    }));
  });

  const cancelPermissionDialog = () => {
    data.menu = null;
    data.permissionDialog = !data.permissionDialog;
  };

  const getPermissions = (val) => {
    const { id, category } = data.categories.find((cat) => cat.category === val);
    data.selectedCategory = category;
    getPermissionsByResource(id, category).then((response) => {
      data.category = response.data.data;
    });
  };

  const addToSelection = (item: any) => {
    const idx = data.selected.map((i) => i.id).indexOf(item.id);
    if (idx !== -1) {
      data.selected.splice(idx, 1);
    } else {
      data.selected.push(item);
    }
  };

  const save = () => {
    if (data.formData.id) {
      updateMenuItem(data.formData);
    } else {
      createMenuItem(data.formData);
    }
  };

  return {
    HEADERS,
    TITLE,
    TYPE,
    TABLE_ROWS,

    data,
    items,

    openDialog,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,
    openPermissionDialog,

    getData,
    save,

    updateMenuItem,
    deleteItem,

    addPermissions,
    getPermissions,
    addToSelection,
    cancelPermissionDialog,
    createMenuItem,
  };
};
