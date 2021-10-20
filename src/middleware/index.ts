import Vue from "vue";
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";
import store from "@/store";

const DEFAULT_TITLE = "FFARS - Facility Financial Accounting & Reporting System";

const getCurrentUser = () => {
  return store.getters["Auth/getCurrentUser"];
};

const getLoginStatus = async (): Promise<any> => {
  const loginStatus = await store.getters["Auth/getLoginStatus"];
  return loginStatus ? loginStatus.isLoggedIn : false;
};

const setTitle = async (to, _, next) => {
  Vue.nextTick(() => {
    document.title = `${to.meta.title} - Facility Financial Accounting & Reporting System (FFARS)` || DEFAULT_TITLE;
  });
  next();
};

const validateToken = async (to, _, next) => {
  const TO_PATH = to.path;
  const currentUser = await getCurrentUser();
  const token = currentUser ? currentUser.token : null;
  if (token) {
    try {
      const { exp } = VueJwtDecode.decode(token);
      if (Date.now() >= exp * 1000) {
        const message = "Token has expired";
        // show login pop up
        store.dispatch("LoginDialog/SHOW", message);
        next();
      } else {
        //console.log("token is still valid");
        // store.getters["Snackbar/getSnackBar"];
        next();
      }
    } catch (error) {
      // return error in production env
      //console.log(error, "error from decoding token");
      return false;
    }
  } else {
    next(`/login?redirect=${TO_PATH}`);
  }
};

const setHeaders = async (to, _, next) => {
  // check the path user is trying to access
  const TO_PATH = to.path;

  // get current logged in user
  const currentUser = await getCurrentUser();
  //console.log("current user", currentUser);

  /**
   * if there is a logged in user
   * set token in the request header
   * set content type in request headers
   * set accept type in request headers
   * then continue to the next middleware pipeline
   * if there is no user, redirect to login page
   * once logged in, redirect user back to the path he/she is
   * trying to access
   *
   **/

  if (currentUser) {
    next();
  } else {
    next(`/login?redirect=${TO_PATH}`);
  }
};

const auth = async (to, _, next) => {
  const currentUser = getCurrentUser();
  const loggedIn = getLoginStatus();
  const TO_PATH = to.path;
  const hasToken = axios.defaults.headers.common.Authorization;

  if (!hasToken) {
    const token = currentUser.token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${currentUser.token}`;
  }

  if (to.matched.some((record: any) => record.meta.requiresAuth) && currentUser) {
    if (loggedIn) {
      await forcePasswordChange(next, currentUser);
    } else {
      next(`/login?redirect=${TO_PATH}`);
    }
  } else {
    next();
  }
};

const forcePasswordChange = async (next, user) => {
  const msg = { message: "Please Reset Your Password" };
  if (user.password_changed) {
    console.log("password changed?", user.password_changed)
    next();
  } else {
    console.log("password changed?", user.password_changed)
    store.dispatch("ChangePasswordDialog/SHOW", msg);
  }
}

export {
  setTitle,
  validateToken,
  setHeaders,
  auth,
  getCurrentUser,
  getLoginStatus,
  forcePasswordChange,
};
