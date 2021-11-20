import { reactive, onMounted, set, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import {
  get,
  create,
  update,
  deleteUser,
  toggleActive,
  resetPassword,
  addApprovalRoles,
} from "../services/user.service";
import { getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";
import { get as getRoles } from "@/components/role/services/role-services";
import { get as getLevels } from "@/components/admin-area/level/services/level-services";
import { get as getApprovalRoles } from "@/components/approval/role/services/approval-role-services";
import { get as getFacilities } from "@/components/facility/facility/services/facility.service";
import { User } from "../types/User";

import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("Auth");

export const useUser = (type?: string): any => {
  const { currentUser } = useState(["currentUser"]);
  const dataItems: Array<User> = [];
  const userData = {} as User;
  const data = reactive({
    title: "Manage Users",
    currentUser: null,
    valid: true,
    status: "",
    isOpen: false,
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
    modalTitle: "",
    headers: [
      { text: "Check Number", value: "check_number" },
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
      (v: string) => (v && v.length <= 10) || "Name must be less than 10 characters",
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
    search: { can_approve: false },
  });

  onMounted(() => {
    if (type === "APPROVAL") {
      initializeApproval();
    } else {
      initialize();
    }
  });

  const initializeApproval = () => {
    get({ per_page: 10, search: { can_approve: true } }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } =
        response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
    loadApprovalRoles();
  };

  const initialize = () => {
    get({ per_page: 10 }).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
    loadLevels();
    getNodes();
    loadRoles({});
    data.currentUser = currentUser;
  };

  const cancelDialog = () => {
    data.formData = {} as User;
    data.formData.roles = [];
    data.isFacilityUser = false;
    data.modal = !data.modal;
  };

  const save = () => {
    if (data.formData.id) {
      updateUser(data.formData);
    } else {
      createUser(data.formData);
    }
  };

  const users = computed(() => {
    return data.items.map((user: any) => ({
      ...user,
      fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
      displayRoles: user.roles.map((r: any) => r.name),
    }));
  });

  const approvalUsers = computed(() => {
    return data.items.map((user: any) => ({
      ...user,
      fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
      displayRoles: user.approval_roles.map((r: any) => r.name),
    })).filter((user: any) => {
      return user.can_approve === true;
    });
  });

  const usersToAssign = computed(() => {
    return data.items.map((user: any) => ({
      ...user,
      fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
      displayRoles: user.roles.map((r: any) => r.name),
    })).filter((user) => {
      return user.can_approve === false;
    })
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

  const facilities = computed(() => {
    return data.facilities.map((facility) => ({
      ...facility,
      label: `${facility.name} - (${facility.facility_type.name})`,
    }));
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
      loadRoles({ search: { level_id: location.level_id } });
      data.currentItem = location;
      data.formData = formData;
      if (formData.facility_id) {
        data.isFacilityUser = true;
        loadFacilities();
      }
      data.modalTitle = "Update";
    } else {
      data.selectedRoles = [];
      data.modalTitle = "Create";
    }
    data.modal = !data.modal;
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

  const loadLocationChildren = (location: any) => {
    data.currentItem = data.currentItem === location ? null : location;
    data.location = location;
    data.formData["location"] = location;
    loadRoles({ search: { level_id: location.level_id } });
    toggleFacilitylOption(location);
    data.formData.location_id = location.id;
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

  const getNodes = (id?: number | string) => {
    getChildren(id).then((response: AxiosResponse) => {
      data.node = response.data.data;
    });
  };

  const loadRoles = (params?: any) => {
    getRoles(params).then((response: AxiosResponse) => {
      data.roles = response.data.data.data;
    });
  };

  const loadLevels = () => {
    getLevels({}).then((response: AxiosResponse) => {
      data.levels = response.data.data.data;
    });
  };

  const toggleFacilitylOption = (location: any) => {
    const level = data.levels.find((level) => level.id === location.level_id);
    if (level.code === "WARD" || level.code === "VILLAGE_MTAA") {
      data.showFacility = true;
      checkForMoreClicks(level);
    } else {
      data.showFacility = false;
    }
  };

  const checkForMoreClicks = (level: any) => {
    if ((data.showFacility = true) && (level.code === "WARD" || level.code === "VILLAGE_MTAA")) {
      loadFacilities();
    }
  };

  const loadFacilities = () => {
    const isFacilityUser = !!data.isFacilityUser;
    data.isFacilityUser = isFacilityUser;
    getFacilities({ search: { location_id: data.location["id"] } }).then((response: AxiosResponse) => {
      data.facilities = response.data.data.data;
    });
  };

  const filterRoles = (term: string) => {
    const result = data.roles.filter((item) => item.name.toLowerCase().includes(term.toLowerCase()));
    data.roles = result;
    return data.roles;
  };

  const upsert = (array, item) => {
    const idx = array.findIndex((_item: any) => _item.id === item.id);
    if (idx > -1) {
      array.splice(idx, 1);
    } else {
      array.push(item);
    }
    return array;
  };

  const onChangeList = ({ source, destination }): void => {
    destination.forEach((item) => {
      data.roles = upsert(source, item);
    });
    data.formData.roles = destination;
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
    data.showApprovalDialog = true;
  };

  const loadApprovalRoles = () => {
    getApprovalRoles({}).then((response: AxiosResponse) => {
      data.approvalRoles = response.data.data.data;
    });
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
      data.payload = { user_id: data.item.id, entries: [], role_id: null};
      delete data.payload.role_id;
      closeConfirmDialog();
    }

    addApprovalRoles(data.payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        initializeApproval();
        data.modal = false;
      }
    });
  };

  return {
    data,
    openActivationDialog,
    openApprovalRoleDialog,

    openDialog,
    toggleStatus,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,
    filterRoles,
    selectedRoles,
    onChangeList,
    confirmTitle,

    loadLocationChildren,
    loadFacilities,
    getNodes,
    getData,
    users,
    facilities,
    message,
    closeActivationDialog,

    updateUser,
    save,
    deleteItem,
    status,
    resetPasswd,
    approvalUsers,
    usersToAssign,
    onUserSelection,
    addApprovalRole,
  };
};
