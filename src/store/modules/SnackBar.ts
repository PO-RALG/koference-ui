const state = {
  show: false,
  message: {},
  requestsPending: 0,
};

const getters = {
  isVisible(state) {
    return state.show;
  },

  getStatus(state) {
    return { ...state.show, ...state.message };
  },
};

const actions = {
  SHOW({ commit }, payload) {
    commit("SHOW", payload);
  },

  HIDE({ commit }) {
    commit("HIDE");
  },

  PENDING({ commit }) {
    commit("PENDING");
  },

  DONE({ commit }) {
    commit("DONE");
  },
};

const mutations = {
  SHOW(state, payload) {
    console.log("payload", payload);
    state.show = true;
    state.message = payload;
  },

  HIDE(state) {
    state.show = false;
    state.message = null;
  },

  PENDING(state) {
    if (state.requestsPending === 0) {
      this.commit("SnackBar/SHOW");
    }

    state.requestsPending++;
  },

  DONE(state) {
    if (state.requestsPending >= 1) {
      state.requestsPending--;
    }

    if (state.requestsPending <= 0) {
      this.commit("SnackBar/HIDE");
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
