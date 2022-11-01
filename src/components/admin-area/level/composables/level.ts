import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";
import {
  get,
  createLevel,
  updateLevel,
  deleteLevel,
} from "../services/level-services";
import { Level } from "../types/Level";

export const useLevels = (): any => {
  const dataItems: Array<Level> = [];
  const levelData: Level = {
    id: null,
    name: "",
    position: null,
  };

  const data = reactive({
    title: "Manage Levels",
    valid: true,
    isOpen: false,
    item: null,
    response: {},
    modalTitle: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Code", value: "code" },
      { text: "Position", align: "start", sortable: true, value: "position" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    items: dataItems,
    formData: levelData,
    params: {
      total: 100,
      size: 10,
    },
    nameRules: [(v: any) => !!v || "Name is required"],
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    get({}).then((response: any) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.formData = {} as Level;
    data.modal = !data.modal;
  };

  const save = () => {
    if (data.formData.id) {
      update(data.formData);
    } else {
      create(data.formData);
    }
  };

  const openDialog = (formData?: Level) => {
    if (formData && formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const update = (data: Level) => {
    updateLevel(data).then((response) => {
      console.log(response.status);
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const create = (data: Level) => {
    createLevel(data).then((response) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const openConfirmDialog = (item: Level) => {
    data.item = item;
    data.isOpen = true;
  };

  const closeConfirmDialog = () => {
    data.item = null;
    data.isOpen = false;
  };

  const deleteItem = (item: number | string) => {
    deleteLevel(item).then((response) => {
      initialize();
    });

    data.item = null;
    data.isOpen = false;
  };

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  return {
    data,

    openDialog,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,

    updateLevel,
    save,
    deleteItem,
    getData,
  };
};
