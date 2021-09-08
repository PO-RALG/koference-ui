import router from "@/router";

const state = {
  isLoggedIn: localStorage.getItem("IS_LOGGED_IN"),
  currentUser: JSON.parse(localStorage.getItem("FFARS_USER")),
  loginError: {},
};

const getters = {
  getCurrentUser: (state) => {
    return state.currentUser;
  },

  isLoggedIn: (state) => {
    return state.isLoggedIn;
  },

  loginError: (state) => {
    return state.loginError;
  },
};

const actions = {
  async LOGOUT({ commit }) {
    commit("LOG_OUT");
  },

  async LOGIN({ commit }, payload: any) {
    commit("AUTHENTICATE", payload);
  },
};

const mutations = {
  AUTHENTICATE(state, payload) {
    state.currentUser = JSON.parse(payload);
    localStorage.setItem("FFARS_USER", payload);
    localStorage.setItem("IS_LOGGED_IN", "YES");
  },

  LOG_OUT(state) {
    state.currentUser = {};
    localStorage.removeItem("FFARS_USER");
    localStorage.setItem("IS_LOGGED_IN", "NO");
    router.push("/login");
  },

  SET_LOGIN_ERROR(state, error) {
    localStorage.setItem("IS_LOGGED_IN", "NO");
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
