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
axios.defaults["isLoading"] = true;

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
  switch (errorResponse.message) {
    case "Token has expired":
      showLoginDialog(errorResponse);
      break;
    default:
      showOtheErrorSnackbar(errorResponse);
      break;
  }
  return Promise.reject({ ...errorResponse });
};

const successHandler = (response: any) => {
  switch (response.config.method) {
    case "put":
    case "post":
    case "delete":
      snackbar.show = true;
      snackbar.color = "success";
      snackbar.icon = "mdi-checkbox-marked-circle";
      snackbar.message = response.data.message;
      // store.dispatch("notify", snackbar);
      store.state.snackbar = snackbar;
  }
  return response;
};

const showLoginDialog = (response: any) => {
  const resp = { path: router.history.current.path, message: response.message };
  store.dispatch("LoginDialog/SHOW", resp);
};

const showOtheErrorSnackbar = (response: any) => {
  snackbar.message = `${response.message}`;
  snackbar.show = true;
  snackbar.color = "red";
  snackbar.icon = " mdi-alert";
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
