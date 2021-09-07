import router from '@/router'

const state = {
  isLoggedIn: false,
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
  }
};

const mutations = {
  AUTHENTICATE(state, payload) {
    state.currentUser = JSON.parse(payload);
    state.isLoggedIn = true;
    localStorage.setItem("FFARS_USER", payload);
  },

  LOG_OUT(state) {
    state.currentUser = {};
    state.isLoggedIn = false;
    localStorage.removeItem("FFARS_USER");
    router.push("/login");
  },

  SET_LOGIN_ERROR(state, error) {
    state.isLoggedIn = false;
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
