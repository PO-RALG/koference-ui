const state = {
  snackbars: [],
};

const getters = {
  getSnackBar: (state) => {
    return state.snackbar;
  },
};

const actions = {
  setSnackBar({ commit }, snackbar) {
    snackbar.showing = true;
    snackbar.color = snackbar.color || "success";
    commit("SET_SNACKBAR", snackbar);
  },
};

const mutations = {
  SET_SNACKBAR(state, snackbar) {
    state.snackbars = state.snackbars.concat(snackbar);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
