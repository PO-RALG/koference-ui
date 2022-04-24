import { reactive, watch, onMounted, computed, ref } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { Document } from "../types/Document";
import { get, create, update, destroy, search } from "../services/document.service";
import { get as getDocumentCategories } from "../../document-category/services/documentcategory.service";

export const useDocument = (): any => {
  const dataItems: Array<Document> = [];
  let documentCategoryData: Document;
  const fileToupload = ref("");
  const imageUrl: any = ref("");

  const data = reactive({
    title: "Manage Document",
    modalTitle: "",
    headers: [
      { text: "Name", align: "start", sortable: false, value: "name" },
      {
        text: "Description",
        align: "start",
        sortable: false,
        value: "description",
      },
      {
        text: "Link",
        align: "start",
        sortable: false,
        value: "link",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    formData: documentCategoryData,
    documentcategories: [],
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
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });

    getDocumentCategories({}).then((response: any) => {
      data.documentcategories = response.data.data.data;
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

  const deleteDocument = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };
  const getDocument = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as Document;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as Document;
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
      updateDocument(data.formData);
    } else {
      data.formData.created_by = 1;
      createDocument(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      data.formData = {} as Document;
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };

  const updateDocument = (data: any) => {
    update(data).then((response) => {
      reloadData();
      cancelDialog();
    });
  };
  const handleSelectedFiles = (event: any) => {
    if (event.target.files.length === 0) {
      imageUrl.value = "";
      fileToupload.value = "";
      return;
    }
    data.formData.document_file = event.target.files[0];
    // console.log("event", event);
    fileToupload.value = event.target.files[0];
  };

  const createDocument = (data: any) => {
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
  // watching a getter

  watch(fileToupload, (fileToupload: any) => {
    if (!(fileToupload instanceof File)) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(fileToupload);

    fileReader.addEventListener("load", () => {
      imageUrl.value = fileReader.result;
    });
  });

  return {
    data,
    openDialog,
    cancelDialog,
    deleteDocument,
    getDocument,
    updateDocument,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    handleSelectedFiles,
    imageUrl,
    getData,
  };
}
