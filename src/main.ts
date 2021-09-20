import Vue from "vue";
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";
import VueAxios from "vue-axios";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import VueCompositionAPI from "@vue/composition-api";

import App from "./App.vue";
import router from "./router";
import store from "@/store";
import vuetify from "./plugins/vuetify";

import "@/mixins";

import "./assets/main.scss";
import "./components/shared";

axios.defaults.headers.common["Accept"] = `application/json`;
axios.defaults.headers.common["Content-Type"] = `application/json`;
axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;

const currentUser = store.getters["Auth/getCurrentUser"];

axios.defaults["isLoading"] = true;
axios.defaults.headers.common["Authorization"] = currentUser ? `Bearer ${currentUser.token}` : null;
axios.defaults.headers.common["Accept"] = `application/json`;
axios.defaults.headers.common["Content-Type"] = `application/json`;
const cancelSource = axios.CancelToken.source();

const snackbar = {
  show: false,
  color: "",
  icon: "",
  message: "",
};

const requestHandler = (request: any) => {
  request.cancelToken = cancelSource.token;
  return request;
};

const errorHandler = (error: any) => {
  const errorResponse = error.data;
  const payload = { info: error.data.errors, message: error.data.message, color: "error", icon: "mdi-alert-box" };
  switch (errorResponse.message) {
    case "Token has expired":
      showLoginDialog(errorResponse);
      break;
    default:
      store.dispatch("SnackBar/SHOW", payload);
      break;
  }
  return Promise.reject({ ...errorResponse });
};

const successHandler = (response: any) => {
  const message = response.data.message;
  const payload = { info: message, color: "success", icon: "mdi-information" };
  switch (response.config.method) {
    case "put":
    case "post":
    case "delete":
      store.dispatch("SnackBar/SHOW", payload);
  }
  return response;
};

const showLoginDialog = (response: any) => {
  const resp = { message: response.message };
  store.dispatch("LoginDialog/SHOW", resp);
};

axios.interceptors.request.use(
  (config) => {
    if (config["isLoading"]) {
      store.dispatch("Loader/PENDING");
    }
    return requestHandler(config);
  },
  (error) => {
    if (error.config["isLoading"]) {
      store.dispatch("Loader/DONE");
    }
    return errorHandler(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.config["isLoading"]) {
      store.dispatch("Loader/DONE");
    }
    return successHandler(response);
  },
  (error) => {
    const response = error.response;

    if (response.config["isLoading"]) {
      store.dispatch("Loader/DONE");
    }
    return errorHandler(response);
  }
);

Vue.use(VueCompositionAPI);
Vue.use(VueJwtDecode);
Vue.use(PerfectScrollbar);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
