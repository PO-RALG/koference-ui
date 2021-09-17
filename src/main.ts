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
  switch (error.response.status) {
    case 500:
      show500ErrorSnackbar(error.response);
      break;
    default:
      showOtheErrorSnackbar(error.response);
      break;
  }
  return Promise.reject({ ...error });
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

const show500ErrorSnackbar = (response: any) => {
  const _tokenExpiredMessage = "Token has expired";
  snackbar.message = `${response.data.message}`;
  console.log("response text", snackbar.message);
  snackbar.show = true;
  snackbar.color = "red";
  snackbar.icon = " mdi-alert";
};

const showOtheErrorSnackbar = (response: any) => {
  snackbar.message = `${response.data.message}`;
  console.log("response text", snackbar.message);
  snackbar.show = true;
  snackbar.color = "red";
  snackbar.icon = " mdi-alert";
};

axios.defaults["isLoading"] = true;

axios.interceptors.request.use(
  (config) => {
    if (config["isLoading"]) {
      store.dispatch("Loader/PENDING");
    }
    return config;
  },
  (error) => {
    if (error.config["isLoading"]) {
      store.dispatch("Loader/DONE");
    }
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.config["isLoading"]) {
      store.dispatch("Loader/DONE");
    }
    return response;
  },
  (error) => {
    const response = error.response;

    if (response.config["isLoading"]) {
      store.dispatch("Loader/DONE");
    }
    return Promise.reject(error);
  }
);

Vue.use(VueCompositionAPI);
Vue.use(PerfectScrollbar);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
