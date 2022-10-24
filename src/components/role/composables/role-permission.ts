import { reactive, onMounted, computed, SetupContext } from "vue";
import { AxiosResponse } from "axios";
import { find, getPermissions, addPermissions as assignPermissions } from "../services/role-services";
import router from "@/router";

export const useRolePermission = ({ attrs }): any => {
  const data = reactive({
    valid: true,
    role: null,
    selected: [],
    permissions: [],
  });

  onMounted(() => {
    initialize();
  });

  const initialize = () => {
    const roleID: any = attrs.id;
    find(roleID).then((response: AxiosResponse) => {
      data.role = response.data.data;
      data.selected = response.data.data.permisions;
    });

    getPermissions({}).then((response: AxiosResponse) => {
      data.permissions = response.data.data;
    });
  };

  const addToSelection = (item: any) => {
    const res = data.selected.find((el) => el.id === item.id);
    if (res) {
      data.selected = data.selected.filter((el) => el.id !== res.id);
    } else {
      data.selected.push(item);
    }
  };

  const addPermissions = () => {
    const payload = {
      role_id: attrs.id,
      permissions: data.selected.map((val) => val.id),
    };
    assignPermissions(payload).then((response) => {
      if (response.status === 200) {
        router.push({ path: `/manage-roles` });
      }
    });
  };

  const goBack = () => {
    router.push({ path: `/manage-roles` });
  };

  const permissions = computed(() => {
    return data.permissions;
  });

  const filterPermissions = (name?) => {
    if (name) {
      permissions.value.filter((entry: any) => entry.resource.includes(name));
      return permissions;
    } else {
      return permissions;
    }
  };

  return {
    data,
    addToSelection,
    addPermissions,
    permissions,
    filterPermissions,
    goBack,
  };
};
