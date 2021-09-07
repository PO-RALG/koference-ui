import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";

import "./assets/main.scss";
import "./components/shared";

import PerfectScrollbar from "vue2-perfect-scrollbar";
import VueCompositionAPI from "@vue/composition-api";

axios.defaults.headers.common["Accept"] = `application/json`;
axios.defaults.headers.common["Content-Type"] = `application/json`;
axios.defaults.headers.common["Authorization"] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC92MVwvbG9naW4iLCJpYXQiOjE2MzEwMTY1NTYsImV4cCI6MTYzMTAyMDE1NiwibmJmIjoxNjMxMDE2NTU2LCJqdGkiOiJ1MERYY2hWRThCWUtEdDdkIiwic3ViIjoxLCJwcnYiOiJiOTEyNzk5NzhmMTFhYTdiYzU2NzA0ODdmZmYwMWUyMjgyNTNmZTQ4In0.udeS5MFw3BeuSt9fzQlc7MFul5VAFV6LcvgxZh25W3U`;
axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;

const snackbar = {
  show: false,
  color: "",
  icon: "",
  message: "",
};

const currentUser = store.getters["Auth/getCurrentUser"];

currentUser ? (axios.defaults.headers.common["Authorization"] = `Bearer ${currentUser.token}`) : null;

axios.defaults.headers.common["Accept"] = `application/json`;
axios.defaults.headers.common["Content-Type"] = `application/json`;

const requestHandler = (request: any) => {
  return request;
};

const errorHandler = (error: any) => {
  switch (error.response.status) {
    case 500:
      show500ErrorSnackbar(error.response);
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
  snackbar.message = `500: ${response.statusText}`;
  snackbar.show = true;
  snackbar.color = "red";
  snackbar.icon = " mdi-alert";
};

//  Add interceptors
axios.interceptors.request.use((request) => requestHandler(request));

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
