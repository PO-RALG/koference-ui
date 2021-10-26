import Vue from "vue";
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";
import VueAxios from "vue-axios";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import VueCompositionAPI from "@vue/composition-api";
import moment from "moment"; //require

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import vuetify from "@/plugins/vuetify";

import "@/mixins";
import filters from "./filters";

import "@/assets/main.scss";
import "@/components/shared";
import capitalize from "@/helpers/FormatHelper";
import getCurrentUser from "@/helpers/CurrentUserHelper";

axios.defaults.headers.common["Accept"] = `application/json`;
axios.defaults.headers.common["Content-Type"] = `application/json`;
axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;

axios.defaults["isLoading"] = true;
const cancelSource = axios.CancelToken.source();

interface SnackBarPayload {
  color: string;
  error?: Record<string, unknown>;
  title: string;
  icon: string;
  class: string;
}

const requestHandler = async (request: any) => {
  const currentUser = await getCurrentUser();
  request.cancelToken = cancelSource.token;

  // set facility_id in the request params so
  request.params = request.params || {};
  const facilityID = router.currentRoute.query.facility_id;
  request.params["facility_id"] = facilityID;

  axios.defaults.headers.common["Authorization"] = currentUser ? `Bearer ${currentUser.token}` : null;
  axios.defaults.headers.common["Accept"] = `application/json`;
  axios.defaults.headers.common["Content-Type"] = `application/json`;
  return request;
};

const errorHandler = (error: any) => {
  const payload: SnackBarPayload = {
    error: error.data.errors,
    title: capitalize(error.data.message),
    color: "info",
    icon: "mdi-alert-box",
    class: "info--text",
  };

  switch (error.data.message) {
    case "Token has expired":
      showLoginDialog(error.data);
      break;
    default:
      store.dispatch("SnackBar/SHOW", payload);
      break;
  }
  return Promise.reject({ ...error.data });
};

const successHandler = (response: any) => {
  const payload: SnackBarPayload = {
    title: capitalize(response.data.message),
    color: "success",
    icon: "mdi-information",
    class: "message success--text",
  };

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
Vue.use(VueAxios, axios, moment);
Vue.use(filters);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
