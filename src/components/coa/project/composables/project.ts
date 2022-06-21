import { AxiosResponse } from "axios";
import { reactive, onMounted } from "@vue/composition-api";
import {
  get,
  create,
  update,
  destroy,
  search,
} from "../services/project.service";

import { Project } from "../types/Project";

export const useProject = (): any => {
  const dataItems: Array<Project> = [];
  let financialYearData: Project;

  const data = reactive({
    title: "Manage projects",
    modalTitle: "",
    headers: [
      {
        text: "Project Code",
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
    formData: financialYearData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
  });

  onMounted(() => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = {
        from,
        to,
        total,
        current_page,
        per_page,
        last_page,
      };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  });

  const searchCategory = (categoryName) => {
    console.log("argument", categoryName);

    if (categoryName != null) {
      search({ code: categoryName.code }).then((response: any) => {
        //// data", response);
        data.items = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const deleteProject = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const getProject = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as Project;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as Project;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const save = () => {
    if (data.formData.id) {
      updateProject(data.formData);
    } else {
      createProject(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as Project;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateProject = (data: any) => {
    update(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };

  const createProject = (data: any) => {
    create(data).then((response) => {
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

  return {
    data,
    getData,
    openDialog,
    cancelDialog,
    deleteProject,
    getProject,
    updateProject,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
  };
};
