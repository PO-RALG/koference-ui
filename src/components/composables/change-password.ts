import { reactive, onMounted, computed } from "vue";
import { changePassword } from "../services";
import { AxiosResponse } from "axios";
import store from "@/store";
import router from "@/router";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("ChangePasswordDialog");

export const useChangePasswordDialog = (): any => {
  const data = reactive({
    valid: true,
    show: true,
    errorMessage: "",
    loginMessage: "",
    loading: false,
    current_password: "",
    password: "",
    password_confirmation: "",

    passwordRules: [
      (v) => !!v || "Password is required",
    ],

    newPasswordRules: [
      (v: any) => /^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,50}$/.test(v) ||
      "A Valid Password Must Contain Only Alphanumeric Characters",
      (v) => !!v || "New Password is required",
    ],

    passwordConfirmationRules: [
      (v: any) => !!v || "Password Confirmation is required",
      (v: any) => (v === data.password) || "Password & Password Confirmation Must Match",
    ],
  });

  const { show } = useState(["show"]);

  onMounted(() => {
    const { message } = store.getters["ChangePasswordDialog/getStatus"];
    data.loginMessage = message;
  });

  const message = computed(() => {
    return `Plase Change Your Password`;
  });

  const changePass = () => {
    const payload = {
      password: data.password,
      current_password: data.current_password,
      password_confirmation: data.password_confirmation,
    };

    changePassword(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        cancelDialog();
        router.push("/login");
        store.dispatch("ChangePasswordDialog/DONE");
      }
    });
  };

  const cancelDialog = () => {
    store.dispatch("ChangePasswordDialog/DONE");
  };

  const passwordConfirmationRule = computed(() => {
    return () =>
      data.password === data.password_confirmation ||
      "New Password & Password Confirmation Must Match";
  });

  return {
    changePass,
    data,
    message,
    cancelDialog,
    show,
    passwordConfirmationRule,
  };
};
