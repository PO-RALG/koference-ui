import { reactive, onMounted, watch } from "vue";
import { AxiosResponse } from "axios";

import { QueryStatus } from "../types/Query";
import {
  get,
  create,
  update,
  destroy,
  searchCategories,
  filterQueries,
  filterQueriesClosed,
  getClosed,
} from "../services/query.service";
import router from "@/router";
import { getDocumentTypeCategory } from "../../setup/query-document_type/services/query-document_type.service";
import { uploadFile } from "../../auth/services";
import { sendMailForSubmition } from "../../../components/user/services/user.service";
import {
  trackOneQuery,
  trackOneUserByNames,
} from "../../../components/query/services/query.service";

export const useQuery = (): any => {
  const dataItems: Array<QueryStatus> = [];
  let documentCategoryData: QueryStatus;

  const data = reactive({
    retrivedUserToBind: null,
    formData: {
      id: "",
      description: "",
      queryStatusId: 1,
      queryCategoryId: "",
      files: [],
      queryof_user_id: null,
      usersource: "Known",
    },
    hideOpened: false,
    file: "",
    title: "Grievance Management",
    modalTitle: "",
    headers: [
      {
        text: "Created Date",
        align: "start",
        sortable: true,
        value: "created",
      },
      {
        text: "Category",
        align: "start",
        sortable: true,
        value: "category",
      },
      // {
      //   text: "Description",
      //   align: "start",
      //   sortable: true,
      //   value: "description",
      // },

      {
        text: "Status",
        align: "start",
        sortable: true,
        value: "status",
      },
      {
        text: "SAP",
        align: "start",
        sortable: true,
        value: "sap",
      },
      {
        text: "Days Passed",
        align: "start",
        sortable: true,
        value: "days_passed",
      },
      {
        text: "Warning",
        align: "start",
        sortable: true,
        value: "",
      },

      // { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    deletemodal: false,
    items: dataItems,
    itemsToFilter: [],
    documentcategories: [],
    rows: ["10", "20", "50", "100"],
    itemtodelete: "",
    response: {},
    searchTerm: "",
    search: "",
    showingTooltip: false,
    clickedRow: null, // Initialize to null
    searchQuery: "",
    documentTypes: [],
    searchUser: "",
    retrivedUser: "",
  });

  onMounted(() => {
    initialize();
    // getQueryCategories({}).then((response: any) => {
    //   data.queryCategories = response.data;
    // });
    loadDocumentTypeSetKnown(1);
  });

  const loadDocumentTypeSetKnown = (e) => {
    getDocumentTypeCategory(e).then((response: any) => {
      console.log("response", response);
      data.documentTypes = response.data;
      // data.formData.queryof_user_id = data.retrivedUser[0].id;
    });
  };

  const saveFile = (file, item) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadFile(formData).then((response) => {
        console.log("response:", response);
        const fileInfo = {
          file_path: response.data.current_name,
          queryDocumentTypeId: item.id,
        };
        data.formData.files.push(fileInfo);
        console.log("path:", data.formData);

        //remove duplicates but keep the last updated score!
        // data.formData.files.reverse();
        // data.formData.files = _.uniqBy(data.formData2, "current_name");
        // this.loading2 = false;
      });
    }
  };

  const submitFomrm = () => {
    if (data.formData.id) {
      // updateQueryCategory(data.formData);
    } else {
      createData(data.formData).then((response) => {
        data.modal = false;
        data.formData = {
          id: "",
          description: "",
          queryof_user_id: null,
          queryStatusId: 1,
          queryCategoryId: "",
          files: [],
          usersource: "Anonymous",
        };
        data.formData.files = [];
        data.documentTypes = [];
        // console.log("response:", response);
        data.retrivedUserToBind.query = response.data;
        sendMailForSubmition(data.retrivedUserToBind);
      });
    }
  };

  const trackUser = (item: any) => {
    // data.searchTerm = "";
    const regSearchTerm = item ? item : data.searchUser;
    trackOneUserByNames({ regSearchTerm }).then((response) => {
      data.retrivedUser = response.data;
      data.retrivedUserToBind = response.data[0];
      data.formData.queryof_user_id = response.data[0].id;
      data.formData.usersource = "Known";
    });
  };

  const handleRowClick = (rowData) => {
    console.log("oneRow", rowData);

    data.clickedRow = rowData; // Set the clicked row data

    router.push({
      name: "another",
      query: { data: JSON.stringify(rowData) },
    });
  };
  const showTooltip = () => {
    data.showingTooltip = true;
  };
  const hideTooltip = () => {
    data.showingTooltip = false;
  };

  const filterQuery = (item: any) => {
    // data.searchTerm = "";
    const regSearchTerm = item ? item : data.searchQuery;
    filterQueries({ regSearchTerm }).then((response) => {
      data.items = response.data;
    });
  };

  const filterQueryClosed = (item: any) => {
    // data.searchTerm = "";
    const regSearchTerm = item ? item : data.searchQuery;
    filterQueriesClosed({ regSearchTerm }).then((response) => {
      data.items = response.data;
    });
  };

  const reloadClosedCase = () => {
    data.items = [];
    getClosed({ per_page: 10 }).then((response: AxiosResponse) => {
      console.log("res", response.data);
      const { from, to, total, current_page, per_page, last_page } =
        response.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data;
      data.itemsToFilter = response.data;
    });
    data.hideOpened = true;
  };

  const clearSearch = () => {
    data.searchTerm = "";
    initialize();
  };

  watch(
    () => data.searchQuery,
    (newSearchQuery, oldSearchQuery) => {
      if (!newSearchQuery.trim()) {
        clearSearch();
      }
    }
  );

  const initialize = () => {
    data.items = [];
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      console.log("res", response.data);
      const { from, to, total, current_page, per_page, last_page } =
        response.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data;
      data.itemsToFilter = response.data;
    });
  };

  // const itemsnew = computed(() => {
  //   return data.itemsDeleted
  //     .map((trashed: any) => ({
  //       ...trashed,
  //     }))
  //     .sort(function (a, b) {
  //       if (a > b) return 1;
  //       return -1;
  //     })
  //     .map((item, index) => ({
  //       ...item,
  //       index: ++index,
  //       fullName: `${item.first_name} ${item.middle_name}  ${item.last_name}`,
  //     }));
  // });

  const searchCategory = (item: string) => {
    if (item) {
      const regSearchTerm = item ? item : "";
      searchCategories({
        active: true,
        regSearch: regSearchTerm,
      }).then((response: AxiosResponse) => {
        data.documentcategories = response.data.data.data;
      });
    } else {
      reloadData();
    }
  };

  const reloadData = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data;
    });
    data.hideOpened = false;
  };

  const getData = () => {
    get(data).then((response) => {
      console.log("data", response.data);
    });
  };

  const cancelDialog = () => {
    data.formData = {} as QueryStatus;
    data.modal = !data.modal;
  };

  const cancelConfirmDialog = () => {
    data.formData = {} as QueryStatus;
    data.deletemodal = false;
  };

  const remove = () => {
    destroy(data.itemtodelete).then(() => {
      reloadData();
      data.deletemodal = false;
    });
  };

  const deleteDialog = (deleteId: any) => {
    data.deletemodal = !data.modal;
    data.itemtodelete = deleteId;
    // console.log("delete year", data);
  };

  const save = () => {
    if (data.formData.id) {
      updateQueryCategory(data.formData);
    } else {
      createData(data.formData);
    }
  };

  const openDialog = (formData?: any) => {
    if (formData.id) {
      data.formData = formData;
      data.modalTitle = "Update";
    } else {
      // data.formData = {} as QueryStatus;
      data.modalTitle = "Create";
    }

    data.modal = !data.modal;
  };

  const updateQueryCategory = (data: any) => {
    update(data).then(() => {
      reloadData();
      cancelDialog();
    });
  };

  const createData = (data: any) => {
    create(data).then((response) => {
      if (response.status === 201) {
        reloadData();
        cancelDialog();
      }
    });
  };

  return {
    data,
    trackUser,
    submitFomrm,
    saveFile,
    openDialog,
    cancelDialog,
    getData,
    updateQueryCategory,
    save,
    reloadData,
    remove,
    cancelConfirmDialog,
    searchCategory,
    deleteDialog,
    showTooltip,
    hideTooltip,
    handleRowClick,
    filterQuery,
    filterQueryClosed,
    clearSearch,
    reloadClosedCase,
  };
};
