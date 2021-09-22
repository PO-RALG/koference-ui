import { reactive, onMounted, computed } from "@vue/composition-api";
import { authenticate, setUser } from "../services";
import { AxiosResponse } from "axios";
import store from "@/store";
import router from "@/router";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("LoginDialog");

export const useLoginDialog = (): any => {
  const data = reactive({
    valid: true,
    show: true,
    errorMessage: "",
    loginMessage: "",
    loading: false,
    email: "",
    emailRules: [
      (v: any) => !!v || "Email is required",
      (v: any) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be a valid email",
    ],
    password: "",
    passwordRules: [(v: any) => !!v || "Password is required"],
  });

  const { show } = useState(["show"]);

  onMounted(() => {
    const { message, path } = store.getters["LoginDialog/getStatus"];
    data.loginMessage = message;
  });

  const message = computed(() => {
    return data.loginMessage ? `Your ${data.loginMessage}` : `Your token has expired`;
  });

  const login = () => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    authenticate(payload).then((response: AxiosResponse) => {
      if (response.status === 200) {
        setUser(response.data.data.user);
        cancelDialog();
        router.go(0);
        store.dispatch("LoginDialog/DONE");
      }
    });
  };

  const cancelDialog = () => {
    store.dispatch("LoginDialog/DONE");
  };

  return {
    login,
    data,
    message,
    cancelDialog,
    show,
  };
};
