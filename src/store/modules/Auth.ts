import router from "@/router";

const state = {
  currentUser: JSON.parse(localStorage.getItem("FFARS_USER")),
  loginError: {},
  app: JSON.parse(localStorage.getItem("FFARS_APP")),
  loginStatus: JSON.parse(localStorage.getItem("FFARS_LOGIN_STATUS")),
};

const getters = {
  getCurrentUser: (state) => {
    return state.currentUser;
  },

  getSiteName: (state) => {
    return state.app;
  },

  getLoginStatus: (state) =>{
    return state.loginStatus;
  },

  loginError: (state) => {
    return state.loginError;
  },
};

const actions = {
  async LOGOUT({ commit }) {
    commit("LOG_OUT");
  },

  async APP_NAME({commit }, payload) {
    commit("SET_APP_NAME", payload);
  },

  async LOGIN({ commit }, payload: any) {
    commit("AUTHENTICATE", payload);
  },
};

const mutations = {
  AUTHENTICATE(state, payload) {
    const loginStatus = { isLoggedIn: true };
    state.currentUser = JSON.parse(payload);
    state.loginStatus = loginStatus;
    localStorage.setItem("FFARS_USER", payload);
    localStorage.setItem("FFARS_LOGIN_STATUS", JSON.stringify(loginStatus));
  },

  SET_APP_NAME(state, payload) {
    const app = { name: payload };
    state.app = app;
    localStorage.setItem("FFARS_APP", JSON.stringify(app));
  },

  LOG_OUT(state) {
    const loginStatus = { isLoggedIn: false };
    state.loginStatus = loginStatus;
    state.currentUser = {};
    localStorage.removeItem("FFARS_USER");
    localStorage.removeItem("FFARS_LOGIN_STATUS");
    router.push("/login");
  },

  SET_LOGIN_ERROR(state, error) {
    localStorage.removeItem("FFARS_LOGIN_STATUS");
    localStorage.removeItem("FFARS_LOGIN_STATUS");
    state.loginError = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
