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

//  Add interceptors
axios.interceptors.request.use((request) => {
  if (request.url === "/api/v1/login") {
    return request;
  } else {
    const currentUser = store.getters["Auth/getCurrentUser"];
    const token = currentUser.token ? currentUser.token : null;
    try {
      const { exp } = token ? VueJwtDecode.decode(token) : null;
      const tokenHasExpired = Date.now() >= exp * 1000;
      if (tokenHasExpired) {
        //console.log("in main: token has expired?", tokenHasExpired);
        cancelSource.cancel("in main: token has expired?");
        //console.log("the request", request);
        return false;
      } else {
        //console.log("in main: token has expired?", tokenHasExpired);
        return requestHandler(request);
      }
    } catch (error) {
      return Promise.reject({ ...error });
    }
  }
});

axios.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error)
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
