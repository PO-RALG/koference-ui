import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { get, create, update, destroy, search } from "../services/activity.service";
import { Activity } from "../types/Activity";
import { Project } from "@/components/coa/project/types/Project";
import { get as getProject } from "@/components/coa/project/services/project.service";
import { get as getSubBudgetClass } from "@/components/coa/sub-budget-class/services/sub-budget-classes.service";

export const useActivity = (): any => {
  const dataItems: Array<Activity> = [];
  const projects: Array<Project> = [];
  const activityData = {} as Activity;
  let subBudgetClasses: [];

  const data = reactive({
    title: "Manage Activities",
    valid: true,
    isOpen: false,
    node: null,
    response: {},
    modalTitle: "",
    headers: [
      {
        text: "Code",
        align: "start",
        sortable: false,
        value: "code",
      },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      }
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: activityData,
    params: {
      total: 100,
      size: 10,
    },
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    projects: projects,
    subBudgetClasses: subBudgetClasses,
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

  const searchItem = (itemName: Activity) => {
    if (itemName != null) {
      search({ code: itemName.code }).then((response: AxiosResponse) => {
        data.items = response.data.data.data;
      });
    }
  };

  const getData = (params: Activity) => {
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

  const getProjectData = () => {
    getProject({ per_page: 10 }).then((response: AxiosResponse) => {
      data.projects = response.data.data.data;
    });
  };

  const getSubBudgetClassData = () => {
    getSubBudgetClass({ per_page: 10 }).then((response: AxiosResponse) => {
      data.subBudgetClasses = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.formData = {} as Activity;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as Activity;
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

  const openDialog = (formData?: Activity) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
      data.searchTerm = "";
      searchProjects(formData.project.code);
      searchSubBudgetClasses(formData.sub_budget_class.code);
    } else {
      data.formData = {} as Activity;
      data.modalTitle = "Create";
      data.searchTerm = "";
      getProjectData();
      getSubBudgetClassData();
    }
    data.modal = !data.modal;
  };

  const updateActivity = (data: Activity) => {
    update(data).then(() => {
      cancelDialog();
      getTableData();
    });
  };

  const createActivity = (data: Activity) => {
    create(data).then(() => {
      //cancelDialog();
      getTableData();
    });
  };

  const searchProjects = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getProject({ per_page: 10, regSearch: regSearchTerm }).then((response: AxiosResponse) => {
      data.projects = response.data.data.data;
    });
  };

  const searchSubBudgetClasses = (item: string) => {
    const regSearchTerm = item ? item : data.searchTerm;
    getSubBudgetClass({ per_page: 10, regSearch: regSearchTerm }).then((response: AxiosResponse) => {
      data.subBudgetClasses = response.data.data.data;
    });
  };

  return {
    data,
    openDialog,
    cancelDialog,
    openConfirmDialog,
    getProjectData,
    updateActivity,
    save,
    remove,
    cancelConfirmDialog,
    searchItem,
    getData,
    getSubBudgetClassData,
    searchProjects,
    searchSubBudgetClasses,
  };
};
