import { reactive, onMounted, computed } from "vue";
import { AxiosResponse } from "axios";
import {
  get,
  create,
  maprole,
  update,
  deleteUser,
  toggleActive,
  resetPassword,
  addApprovalRoles,
  getTrushed,
  restoreUser,
} from "../services/user.service";
// import { get as getApprovalRoles } from "@/components/approval/role/services/approval-role-services";
import { get as getFacilities } from "@/components/facility/facility/services/facility.service";
import { User } from "../types/User";

import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("Auth");

export const useUser = (type?: string): Record<string, unknown> => {
  const { currentUser } = useState(["currentUser"]);
  const dataItems: Array<User> = [];
  const userData = {} as User;
  const data = reactive({
    title: "Manage Users",
    currentUser: null,
    status: "",
    isOpen: false,
    roleModal: false,
    selectedRoles: [],
    approvalRoles: [],
    filteredRoles: [],
    levels: [],
    source: [],
    user: null,
    confirmTitle: "",
    destination: [],
    facilities: [],
    showFacility: false,
    isFacilityUser: false,
    node: null,
    currentItem: null,
    action: "",
    show: false,
    item: userData,
    itemName: "name",
    location: {},
    response: {},
    roles: [],
    approvalUsers: [],
    modalTitle: "",
    itemsDeleted: [],
    itemsToFilter: [],
    trushModal: false,
    restoreTrashedmodal: false,
    restoreId: "",

    trush_headers: [
      { text: "No", value: "index" },
      { text: "NIN", value: "nin_number" },
      { text: "Phone Number", value: "phone_number" },
      { text: "Name", align: "start", sortable: false, value: "fullName" },
      { text: "Email", value: "email" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    headers: [
      { text: "NIN", value: "nin_number" },
      { text: "Phone Number", value: "phone_number" },
      { text: "Name", align: "start", sortable: false, value: "fullName" },
      { text: "Email", value: "email" },
      { text: "Roles", value: "displayRoles" },
      { text: "Activation", value: "activations", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    approval_header: [
      { text: "Name", align: "start", sortable: false, value: "fullName" },
      { text: "Email", value: "email" },
      { text: "Approval Roles", value: "displayRoles" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    searchTerm: "",
    searchTermTrushed: "",
    modal: false,
    items: dataItems,
    formData: userData,
    rows: ["10", "20", "100"],
    params: {
      total: 100,
      size: 10,
    },
    nameRules: [
      (v: string) => !!v || "Name is required",
      (v: string) =>
        (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    requiredRules: [(v: string) => !!v || "Field is required"],
    email: "",
    emailRules: [
      (v: string) => !!v || "E-mail is required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    showApprovalDialog: false,
    payload: {
      user_id: null,
      role_id: null,
      entries: [],
    },
    userObject: "",
  });

  onMounted(() => {
    if (type === "APPROVAL") {
      loadApprovalUsers();
    } else {
      initialize();
    }
  });
  // onMounted(() => {
  //   if (type === "APPROVAL") {
  //     loadApprovalUsers();
  //   } else {
  //     initialize();
  //   }
  // });

  const filterTrushedUser = () => {
    if (data.searchTermTrushed.length > 3) {
      getTrushed({ regSearch: data.searchTermTrushed }).then(
        (response: AxiosResponse) => {
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
          data.itemsDeleted = response.data.data.data;
        }
      );
    }
    if (
      data.searchTermTrushed.length === 0 ||
      data.searchTermTrushed === null
    ) {
      getTrushed({ per_page: 10 }).then((response: AxiosResponse) => {
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
        data.itemsDeleted = response.data.data.data;
      });
    }
  };

  const resetSearchText = () => {
    data.searchTerm = "";
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const cancelConfirmDialog = () => {
    data.trushModal = false;
  };

  const openRestoreTrashedDialog = (restoreId: any) => {
    data.restoreTrashedmodal = !data.modal;
    data.restoreId = restoreId;
  };

  const cancelRestoreDialog = () => {
    data.restoreTrashedmodal = false;
  };

  const restore = () => {
    restoreUser(data.restoreId).then(() => {
      initialize();
      initializeTrushed();
      data.restoreTrashedmodal = false;
    });
  };

  const trushedNew = computed(() => {
    return data.itemsDeleted
      .map((trashed: any) => ({
        ...trashed,
      }))
      .sort(function (a, b) {
        if (a > b) return 1;
        return -1;
      })
      .map((item, index) => ({
        ...item,
        index: ++index,
        fullName: `${item.first_name} ${item.middle_name}  ${item.last_name}`,
      }));
  });

  // const approvalUsers = computed(() => {
  //   return data.items
  //     .map((user: any) => ({
  //       ...user,
  //       fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
  //       displayRoles: user.approval_role.name,
  //     }))
  //     .filter((user: any) => {
  //       return user.can_approve === true;
  //     });
  // });

  const openTrushedDialog = () => {
    getTrushed({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.itemsDeleted = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
    data.trushModal = !data.modal;
  };

  const loadApprovalUsers = () => {
    get({ search: { can_approve: true } }).then((response: AxiosResponse) => {
      data.items = response.data.data.data;
    });
  };

  const initialize = () => {
    get({ per_page: 100 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data;
      console.log("mmmm", response);
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data;
    });
    data.currentUser = currentUser;
  };
  const initializeTrushed = () => {
    getTrushed({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.itemsDeleted = response.data.data.data;
      data.itemsToFilter = response.data.data.data;
    });
  };

  const cancelDialog = () => {
    data.formData = {} as User;
    data.formData.roles = [];
    data.isFacilityUser = false;
    data.showApprovalDialog = false;
    data.modal = false;
    data.roleModal = false;
  };

  const approvableRole = (name) => {
    // return name === "DT" || name === "FA" || name === "FACILITY_ADMIN";
  };

  const canGetApprovalRole = (user) => {
    // return user.roles.map((r) => r.display_name).some(approvableRole);
  };

  const save = (formData: any) => {
    if (formData.id) {
      delete formData.roles;
      delete formData.menus;
      delete formData.fullName;
      updateUser(formData);
    } else {
      createUser(formData);
    }
  };
  const saveUserRoles = (formData: any) => {
    mapUserRoles(formData);
  };

  const setApprovalRole = () => {
    addApprovalRoles(data.user).then((response: AxiosResponse) => {
      if (response.status === 200) {
        loadApprovalUsers();
        data.showApprovalDialog = false;
      }
    });
  };

  const filterUsers = () => {
    if (data.searchTerm.length > 3) {
      get({ regSearch: data.searchTerm }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    }
    if (data.searchTerm.length === 0) {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    }
  };

  // const resetSearchText = () => {
  //   data.searchTerm = "";
  //   get({ per_page: 10 }).then((response: AxiosResponse) => {
  //     const { from, to, total, current_page, per_page, last_page } =
  //       response.data.data;
  //     data.response = { from, to, total, current_page, per_page, last_page };
  //     data.items = response.data.data.data;
  //   });
  // };

  const users = computed(() => {
    return data.items.map((user: any) => ({
      ...user,
      fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
      // displayRoles: user.roles.map((r: any) => r.name),
    }));
  });

  const approvalUsers = computed(() => {
    return data.items
      .map((user: any) => ({
        ...user,
        fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
        // displayRoles: user.approval_role.name,
      }))
      .filter((user: any) => {
        return user.can_approve === true;
      });
  });

  const usersToAssign = computed(() => {
    return data.items
      .map((user: any) => ({
        ...user,
        fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
        displayRoles: user.roles.map((r: any) => r.name),
      }))
      .filter((user) => {
        return user.can_approve === false;
      });
  });

  const selectedRoles = computed(() => {
    return data.selectedRoles;
  });

  const message = computed(() => {
    return data.action === "DELETE"
      ? `Are you sure you want to ${data.status} this user?`
      : `Are you sure you want to ${data.status} this user?`;
  });

  const confirmTitle = computed(() => {
    return data.action === "DELETE" ? `Delete User` : `${data.status} User`;
  });

  const getData = (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openDialog = (formData?: User) => {
    if (formData && formData.id) {
      data.selectedRoles = formData.roles;
      const location = formData["location"];
      data.currentItem = location;
      data.formData = formData;
      if (formData.facility_id) {
        data.isFacilityUser = true;
      }
      data.modalTitle = "Update";
    } else {
      data.selectedRoles = [];
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
  };
  const openDialogMapRoles = (payload?: any) => {
    data.roleModal = !data.roleModal;
    data.formData.id = payload.id;
    data.formData.roles = payload.roles;
    data.userObject = payload;
  };

  const updateUser = (data: User) => {
    update(data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };

  const createUser = (data: User) => {
    create(data).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        initialize();
      }
    });
  };
  const mapUserRoles = (data: User) => {
    maprole(data).then((response: AxiosResponse) => {
      if (response.status === 200 || response.status === 201) {
        cancelDialog();
        initialize();
      }
    });
  };

  const openConfirmDialog = (item: User) => {
    data.status = "Delete";
    data.item = item;
    data.user = item;
    data.isOpen = true;
  };

  const closeActivationDialog = () => {
    data.item = null;
    data.show = false;
    data.status = null;
    data.user = null;
  };

  const closeConfirmDialog = () => {
    data.item = {} as User;
    data.isOpen = false;
    data.user = null;
  };

  const deleteItem = (item: number | string) => {
    const payload = item;
    deleteUser(payload).then(() => {
      initialize();
    });
    data.item = {} as User;
    data.isOpen = false;
  };

  const filterRoles = (term: string) => {
    const result = data.roles.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    data.roles = result;
    return data.roles;
  };

  const status = computed(() => {
    return data.user && data.user.active ? "De-Activate" : "Activate";
  });

  const resetPasswd = (user) => {
    const payload = { user_id: user.id };
    resetPassword(payload);
  };

  const toggleStatus = () => {
    toggleActive(data.user).then((response) => {
      if (response.status === 200) {
        closeConfirmDialog();
        initialize();
      }
    });
  };

  const openActivationDialog = (user: any) => {
    data.status = user.active ? "De-Activate" : "Activate";
    data.user = user;
    data.show = true;
  };

  const openApprovalRoleDialog = (user) => {
    data.user = user;
    //   loadApprovalRoles(user);
    //   data.showApprovalDialog = true;
    //   data.modalTitle = "Assign";
    // };

    // const loadApprovalRoles = (user) => {
    //   const name = user.roles.map((r) => r.name)[0];
    //   getApprovalRoles({ regSearch: name }).then((response: AxiosResponse) => {
    //     data.approvalRoles = response.data.data.data;
    //   });
  };

  const onUserSelection = (user) => {
    data.payload.user_id = user.id;
    const userLevel = user.location.level_id;
    data.filteredRoles = data.approvalRoles.filter((r: any) => {
      return r.level_id === userLevel;
    });
  };

  const addApprovalRole = (type: string) => {
    if (type === "CREATE") {
      data.payload.entries.push(data.payload.role_id);
      delete data.payload.role_id;
    } else {
      data.payload = { user_id: data.item.id, entries: [], role_id: null };
      delete data.payload.role_id;
      closeConfirmDialog();
    }

    addApprovalRoles(data.payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        loadApprovalUsers();
        data.modal = false;
      }
    });
  };

  return {
    data,
    openActivationDialog,
    openApprovalRoleDialog,
    filterTrushedUser,
    resetSearchText,
    openDialog,
    toggleStatus,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,
    filterRoles,
    selectedRoles,
    confirmTitle,
    getData,
    users,
    filterUsers,
    message,
    closeActivationDialog,
    updateUser,
    save,
    saveUserRoles,
    deleteItem,
    status,
    resetPasswd,
    approvalUsers,
    usersToAssign,
    onUserSelection,
    addApprovalRole,
    canGetApprovalRole,
    setApprovalRole,
    openTrushedDialog,
    trushedNew,
    getTrushed,
    cancelConfirmDialog,
    openRestoreTrashedDialog,
    cancelRestoreDialog,
    restore,
    initializeTrushed,
    openDialogMapRoles,
  };
};
