import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbar: {
      show: true,
      message: "",
      color: "",
      icon: "",
    },
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
      console.log("payload", payload);
      commit("setSnackbar", payload);
    },
  },
});
