import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import VueJwtDecode from "vue-jwt-decode";
import VueAxios from "vue-axios";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import VueMask from "v-mask";
import moment from "moment"; //require
import _ from "lodash";

import VueFusionCharts from "vue-fusioncharts";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import Column2D from "fusioncharts/fusioncharts.charts";

// Register FusionCharts components
Vue.use(VueFusionCharts, FusionCharts, Charts, FusionTheme, Column2D);

import "@/plugins/vuetify-mask";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import vuetify from "@/plugins/vuetify";

import "@/mixins";
import filters from "@/filters";

import "@/assets/main.scss";
import "@/components/shared";
import capitalize from "@/helpers/FormatHelper";
import getCurrentUser from "@/helpers/CurrentUserHelper";

axios.defaults.headers.common["Accept"] = `application/json`;
axios.defaults.headers.common["Content-Type"] = `application/json`;

axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER_URL;

const cancelSource = axios.CancelToken.source();

interface SnackBarPayload {
  color: string;
  error?: Record<string, unknown>;
  title: string;
  icon: string;
  class: string;
}

const requestHandler = async (requestConfig: AxiosRequestConfig) => {
  store.dispatch("Loader/PENDING");
  const currentUser = await getCurrentUser();
  requestConfig.cancelToken = cancelSource.token;

  // set facility_id in the request params so
  requestConfig.params = requestConfig.params || {};
  const facilityID = router.currentRoute.query.facility_id;
  requestConfig.params["facility_id"] = facilityID;

  axios.defaults.headers.common["Authorization"] = currentUser
    ? `Bearer ${currentUser.token}`
    : null;
  axios.defaults.headers.common["Accept"] = `application/json`;
  axios.defaults.headers.common["Content-Type"] = `application/json`;
  return requestConfig;
};

const errorHandler = (error: any) => {
  console.log("erorrrrrrrrr", error.data.errorDetails.message);
  store.dispatch("Loader/DONE");
  const payload: SnackBarPayload = {
    error: error.data.errorDetails.message,
    title: capitalize("Somrthing wrong"),
    color: "warning",
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
  return Promise.reject({ ...error.data.errorDetails.message });
};

const successHandler = (response: AxiosResponse) => {
  store.dispatch("Loader/DONE");
  let message = null;
  if (typeof response.data === "object") {
    message = "Processed successfully";
  } else {
    const messages = response.data.split("\n");
    // const msg = JSON.parse(messages[messages.length - 1]);
    message = "Processed successfully";
  }

  const payload: SnackBarPayload = {
    title: capitalize("Success"),
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
  store.dispatch("Auth/LOGOUT");

  // router.push("/login");

  // store.dispatch("LoginDialog/SHOW", resp);
};

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return requestHandler(config);
  },
  (error) => {
    return errorHandler(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return successHandler(response);
  },
  (error) => {
    let errorResponse = null;
    if (error && !error.response) {
      const payload: SnackBarPayload = {
        title: error,
        color: "error",
        icon: "mdi-error",
        class: "message error--text",
        error: { errors: " Check your network and try again " },
      };
      store.dispatch("Loader/DONE");
      store.dispatch("SnackBar/SHOW", payload);
    } else {
      errorResponse = error.response;
      return errorHandler(errorResponse);
    }
  }
);

Vue.use(VueJwtDecode);
Vue.use(PerfectScrollbar);
Vue.use(VueAxios, axios, moment);
Vue.use(filters);
Vue.use(VueMask);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
