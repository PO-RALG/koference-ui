import { computed, onMounted, reactive, set } from "vue";
import { AxiosResponse } from "axios";
import {
  createArea,
  createAreaFromPlanrep,
  deleteArea,
  get,
  getChildren,
  updateArea,
} from "../services/admin-area-services";

import { get as getLevels } from "../../level/services/level-services";
import { Level } from "../../level/types/Level";
import { AdminArea } from "../types/AdminArea";

export const userAdmiArea = (): any => {
  const dataItems: Array<AdminArea> = [];
  const levelItems: Array<Level> = [];
  const HEADERS = [
    { text: "Name", value: "name" },
    { text: "Code", value: "code" },
    { text: "Actions", value: "actions", sortable: false },
  ];

  const adminAreaData: AdminArea = {
    id: null,
    name: "",
    code: "",
    description: "",
    parent_id: null,
    level_id: null,
    active: false,
  };

  const data = reactive({
    title: "Manage Admin Areas",
    valid: true,
    isOpen: false,
    node: null,
    item: null,
    currentItem: null,
    levels: levelItems,
    modalTitle: "",
    modal: false,
    items: dataItems,
    response: {},
    formData: adminAreaData,
    params: {
      total: 100,
      size: 10,
    },
    nameRules: [(v: any) => !!v || "Name is required"],
  });

  const cancelDialog = () => {
    data.formData = {} as AdminArea;
    data.modal = !data.modal;
  };

  const setLevel = () => {
    console.log("set level");
  };

  const save = () => {
    if (data.formData.id) {
      update(data.formData);
    } else {
      create(data.formData);
    }
  };

  const levels = computed(() => data.levels);

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openDialog = (formData?: AdminArea) => {
    console.log("item", formData);
    if (formData && formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const update = (data: AdminArea) => {
    updateArea(data).then((response) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const create = (data: AdminArea) => {
    createArea(data).then((response) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const pullAdminAreasFromPlanRep = () => {
    createAreaFromPlanrep().then((response) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const openConfirmDialog = (item: AdminArea) => {
    data.item = item;
    data.isOpen = true;
  };

  const closeConfirmDialog = () => {
    data.item = {};
    data.isOpen = false;
  };

  const deleteItem = (item: number | string) => {
    deleteArea(item).then((response) => {
      initialize();
    });
    data.item = null;
    data.isOpen = false;
  };

  const loadLocationChildren = (location: any) => {
    data.currentItem = location.id;
    data.formData.parent_id = location.id;
    if (!location.children) {
      if (location.id !== data.node.id) {
        getChildren(location.id).then((response: AxiosResponse) => {
          if (response.data.data.children.length) {
            set(location, "children", response.data.data.children);
          }
        });
      }
    }
  };

  const searchLevels = (term) => {
    data.levels = data.levels.filter((level) => level.name.includes(term));
  };

  const getNodes = (id?: number | string) => {
    getChildren(id).then((response: AxiosResponse) => {
      data.node = response.data.data;
    });
  };

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

    getLevels({}).then((response: AxiosResponse) => {
      data.levels = response.data.data.data;
    });

    getNodes();
  };

  return {
    HEADERS,
    data,

    openDialog,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,
    getData,

    updateArea,
    save,
    deleteItem,
    pullAdminAreasFromPlanRep,
    loadLocationChildren,
    searchLevels,
    getNodes,
    setLevel,

    levels,
  };
};
