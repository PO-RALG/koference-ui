import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Auth from "./modules/Auth";
import SnackBar from "./modules/SnackBar";
import Loader from "./modules/Loader";
import LoginDialog from "./modules/LoginDialog";
import Drawer from "./modules/Drawer";

export default new Vuex.Store({
  modules: {
    Auth,
    SnackBar,
    Loader,
    LoginDialog,
    Drawer,
  },
});
