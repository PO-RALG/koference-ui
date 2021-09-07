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
  async logout({ commit }) {
    commit("LOG_OUT");
  },
};

const mutations = {
  AUTHENTICATE(state, payload) {
    state.currentUser = payload;
    state.isLoggedIn = true;
  },

  LOG_OUT(state) {
    state.currentUser = {};
    state.isLoggedIn = false;
    localStorage.removeItem("FFARS_USER");
  },

  loginError(state, error) {
    state.loginError = error;
  },

  setLoginStatus(state) {
    state.isLoggedIn = true;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
