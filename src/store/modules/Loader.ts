const state = {
  loading: false,
  requestsPending: 0,
};

const getters = {
  isLoading(state) {
    return state.loading;
  },
}

const actions = {
  SHOW({ commit }) {
    commit("SHOW");
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
  SHOW(state) {
    state.loading = true;
  },

  HIDE(state) {
    state.loading = false;
  },

  PENDING(state) {
    if (state.requestsPending === 0) {
      this.commit("Loader/SHOW");
    }

    state.requestsPending++;
  },

  DONE(state) {
    if (state.requestsPending >= 1) {
      state.requestsPending--;
    }

    if (state.requestsPending <= 0) {
      this.commit("Loader/HIDE");
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
