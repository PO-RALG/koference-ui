const state = {
  isOpen: true,
};

const getters = {
  IS_OPEN(state) {
    return state.isOpen;
  },
};

const actions = {
  OPEN({ commit }) {
    commit("OPEN");
  },

  CLOSE({ commit }) {
    commit("CLOSE");
  },
};

const mutations = {
  OPEN(state) {
    state.isOpen = true;
  },

  CLOSE(state) {
    state.isOpen = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
