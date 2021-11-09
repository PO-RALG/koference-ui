import { AxiosResponse } from "axios";
import { reactive, onMounted } from "@vue/composition-api";
import { useRoute } from "vue2-helpers/vue-router";
import { get, toggleStatus as toggle, create } from "../services/gl.account.service";

export const useGLAccount = (): any => {
  const route = useRoute();

  const data = reactive({
    items: [],
    title: "Manage GL Accounts",
    activateDialog: false,
    itemID: null,
    dialogTitle: "",
    response: {},
    modal: false,
    modalTitle: "Create",
    formData: {
      code: "",
      facility_id: null,
    },
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
      const { from, to, total, current_page, per_page, last_page } = response.data.data;
      data.response = { from, to, total, current_page, per_page, last_page };
      data.items = response.data.data.data;
    });
  };

  const getData = async (params: any) => {
    data.response = params;
    get(params).then((response: AxiosResponse) => {
      data.response = response.data.data;
      data.items = response.data.data.data;
    });
  };

  const openDialog = () => {
    if (route.query.facility_id) {
      data.formData.facility_id = route.query.facility_id;
    }
    data.modal = !data.modal;
  };

  const cancelDialog = () => {
    data.modal = !data.modal;
  };

  const save = () => {
    create(data.formData).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
      }
    });
  };

  return {
    data,
    toggleStatus,
    openActivationDialog,
    cancelActivationDialog,
    openDialog,
    save,
    cancelDialog,
    getData,
  };
};
