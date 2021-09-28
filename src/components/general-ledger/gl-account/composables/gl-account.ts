import { AxiosResponse } from "axios";
import { reactive, onMounted } from "@vue/composition-api";
import { get, toggleStatus as toggle } from "../services/gl.account.service";

export const useGLAccount = (): any => {
  const data = reactive({
    items: [],
    title: "Manage GL Accounts",
    activateDialog: false,
    itemID: null,
    dialogTitle: "",
  });

  const toggleStatus = () => {
    toggle(data.itemID).then(() => {
      init();
      cancelActivationDialog();
    });
  };

  const openActivationDialog = (item) => {
    data.dialogTitle = item.active ? "Deactivate" : "Activate";
    data.itemID = item.id;
    data.activateDialog = true;
  };

  const cancelActivationDialog = () => {
    data.itemID = null;
    data.activateDialog = false;
  };

  onMounted(() => {
    init();
  });

  const init = () => {
    get({ per_page: 20 }).then((response: AxiosResponse) => {
      data.items = response.data.data.data;
    });
  };

  return {
    data,
    toggleStatus,
    openActivationDialog,
    cancelActivationDialog,
  };
};
