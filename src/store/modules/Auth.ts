import router from "@/router";

const state = {
  currentUser: JSON.parse(localStorage.getItem("FFARS_USER")),
  loginError: {},
  loginStatus: JSON.parse(localStorage.getItem("FFARS_LOGIN_STATUS")),
};

const getters = {
  getCurrentUser: (state) => {
    return state.currentUser;
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
