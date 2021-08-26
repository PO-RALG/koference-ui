import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbar: {},
  },
  getters: {
    getSnackBar: (state) => {
      return state.snackbar;
    },
  },
  mutations: {
    setSnackbar(state, payload) {
      state.snackbar = payload;
    },
  },
  actions: {
    notify({ commit }, payload) {
      // console.log("payload dataz", payload);
      commit("setSnackbar", payload);
    },
  },
});
