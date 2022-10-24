import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";
import { get, create, update, deleteEntry } from "../services/menu.service";
import { MenuGroup } from "../types/MenuGroup";

export const useMenuGroups = (): any => {
  const TYPE = "MENU_GROUP";
  const HEADERS = [
    { text: "", sortable: false },
    { text: "#", sortable: false },
    { text: "Icon", value: "icon" },
    { text: "Position", value: "position" },
    { text: "Name", value: "name" },
    { text: "Actions", value: "actions", sortable: false },
  ];

  const TABLE_ROWS = ["10", "20", "30", "40", "50", "100"];

  const dataItems: Array<MenuGroup> = [];
  const menuGroupData = {} as MenuGroup;

  const data = reactive({
    title: "Manage Menu Groups",
    valid: true,
    isOpen: false,
    item: menuGroupData,
    response: {},
    modalTitle: "",
    modal: false,
    items: dataItems,
    formData: menuGroupData,
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    get(TYPE, {}).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.items = response.data.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
    });
  };

  const cancelDialog = () => {
    data.formData = {} as MenuGroup;
    data.modal = !data.modal;
  };

  const save = () => {
    if (data.formData.id) {
      updateMenuGroup(data.formData);
    } else {
      createMenuGroup(data.formData);
    }
  };

  const getData = (params: any) => {
    data.response = params;
    get(TYPE, params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openDialog = (formData?: MenuGroup) => {
    if (formData && formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateMenuGroup = (data: any) => {
    update(TYPE, data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const createMenuGroup = (data: MenuGroup) => {
    create(TYPE, data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const openConfirmDialog = (item: MenuGroup) => {
    data.item = item;
    data.isOpen = true;
  };

  const closeConfirmDialog = () => {
    data.item = {} as MenuGroup;
    data.isOpen = false;
  };

  const deleteItem = (item: number | string) => {
    const payload = item;
    deleteEntry(TYPE, payload).then((response: AxiosResponse) => {
      console.log(response);
      initialize();
    });
    data.item = {} as MenuGroup;
    data.isOpen = false;
  };

  const updatePosition = (item: any) => {
    const { newIndex, element } = item.moved;
    element.position = newIndex + 1;
    update(TYPE, element);
  };

  return {
    TYPE,
    HEADERS,
    TABLE_ROWS,
    data,

    openDialog,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,

    getData,

    updateMenuGroup,
    save,
    deleteItem,
    updatePosition,
  }
}
