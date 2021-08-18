import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";

import "./assets/main.scss";
import "./components/shared";

import PerfectScrollbar from "vue2-perfect-scrollbar";
import VueCompositionAPI from "@vue/composition-api";

axios.defaults.headers.common["Accept"] = `application/json`;
axios.defaults.headers.common["Content-Type"] = `application/json`;
axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;

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
