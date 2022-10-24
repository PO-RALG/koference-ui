import { reactive, onMounted } from "vue";
import { AxiosResponse } from "axios";

import { DocumentCategory } from "../types/DocumentCategory";
import { get, create, update, destroy, search } from "../services/documentcategory.service";

export const useDocumentCategory = (): any => {
  const dataItems: Array<DocumentCategory> = [];
  let documentCategoryData: DocumentCategory;

  const data = reactive({
    title: "Manage Document Category",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: documentCategoryData,
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
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
  };

  const searchCategory = (categoryName) => {
    if (categoryName != null) {
      search({ name: categoryName.name }).then((response: any) => {
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

  const deleteDocumentCategory = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const getDocumentCategory = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as DocumentCategory;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as DocumentCategory;
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
      updateDocumentCategory(data.formData);
    } else {
      createUser(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as DocumentCategory;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateDocumentCategory = (data: any) => {
    update(data).then((response) => {
      if (response.status === 200) {
        reloadData();
        cancelDialog();
      }
    });
  };

  const createUser = (data: any) => {
    create(data).then((response) => {
      if (response.status === 200) {
        reloadData();
        cancelDialog();
      }
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
    openDialog,
    getData,
    cancelDialog,
    deleteDocumentCategory,
    getDocumentCategory,
    updateDocumentCategory,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
  };
};
