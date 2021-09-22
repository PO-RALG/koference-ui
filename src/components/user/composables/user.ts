import { reactive, onMounted, set, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import { get, create, update, deleteUser } from "../services/user.service";
import { getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";
import { get as getRoles } from "@/components/role/services/role-services";
import { get as getLevels } from "@/components/admin-area/level/services/level-services";
import { get as getFacilities } from "@/components/facility/facility/services/facility.service";
import { User } from "../types/User";

export const useUser = (): any => {
  const dataItems: Array<User> = [];
  const userData = {} as User;
  const data = reactive({
    title: "Manage Users",
    valid: true,
    isOpen: false,
    selectedRoles: [],
    levels: [],
    facilities: [],
    showFacility: false,
    isFacilityUser: false,
    node: null,
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
      { text: "Actions", value: "actions", sortable: false },
    ],
    modal: false,
    items: dataItems,
    formData: userData,
    rows: ["20", "50", "100"],
    params: {
      total: 100,
      size: 10,
    },
    nameRules: [
      (v: string) => !!v || "Name is required",
      (v: string) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v: string) => !!v || "E-mail is required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    get({}).then((response: AxiosResponse) => {
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
    loadLevels();
    getNodes();
    loadRoles();
  };

  const cancelDialog = () => {
    data.formData = {} as User;
    data.isFacilityUser = false;
    data.modal = !data.modal;
  };

  const save = () => {
    const roles = data.formData.roles ? data.formData.roles.map((role: any) => role.id) : [];
    set(data.formData, "roles", roles);
    if (data.formData.id) {
      updateUser(data.formData);
    } else {
      createUser(data.formData);
    }
  };

  const users = computed(() => {
    return data.items.map((user) => ({
      ...user,
      fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
    }));
  });

  const selectedRoles = computed(() => {
    return data.selectedRoles;
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
      console.log(response.status);
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
    data.item = item;
    data.isOpen = true;
  };

  const closeConfirmDialog = () => {
    data.item = {} as User;
    data.isOpen = false;
  };

  const deleteItem = (item: number | string) => {
    const payload = item;
    deleteUser(payload).then((response: AxiosResponse) => {
      console.log(response);
      initialize();
    });
    data.item = {} as User;
    data.isOpen = false;
  };

  const loadLocationChildren = (location: any) => {
    data.location = location;
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

  const loadRoles = () => {
    getRoles({}).then((response: AxiosResponse) => {
      data.roles = response.data.data.data;
    });
  };

  const loadLevels = () => {
    getLevels({}).then((response: AxiosResponse) => {
      data.levels = response.data.data.data;
    });
  };

  const toggleFacilitylOption = (location) => {
    const level = data.levels.find((level) => level.id === location.level_id);
    if (level.code === "WARD" || level.code === "VILLAGE_MTAA") {
      data.showFacility = true;
    } else {
      data.showFacility = false;
    }
  };

  const loadFacilities = () => {
    const isFacilityUser = !!data.isFacilityUser;
    data.isFacilityUser = isFacilityUser;
    getFacilities({ regsearch: { location_id: data.location["id"] } }).then((response: AxiosResponse) => {
      data.facilities = response.data.data.data;
    });
  };

  const filterRoles = (term: string) => {
    const result = data.roles.filter((item) => item.name.toLowerCase().includes(term.toLowerCase()));
    data.roles = result;
    return data.roles;
  };

  return {
    data,

    openDialog,
    cancelDialog,
    closeConfirmDialog,
    openConfirmDialog,
    filterRoles,
    selectedRoles,

    loadLocationChildren,
    loadFacilities,
    getNodes,
    getData,
    users,
    facilities,

    updateUser,
    save,
    deleteItem,
  };
};
