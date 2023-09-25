import { ActionTree, GetterTree, MutationTree } from "vuex";
import { RootState } from "../types";
import { SnackBar } from "./types";

const state: SnackBar = {
  show: false,
  message: {},
  requestsPending: 0,
};

const getters: GetterTree<SnackBar, RootState> = {
  isVisible(state): boolean {
    return state.show;
  },

  getStatus(state) {
    return { show: state.show, message: state.message };
  },
};

const actions: ActionTree<SnackBar, RootState> = {
  SHOW({ commit }, payload) {
    commit("SHOW", payload);
    console.log("mesageeeee", payload);
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

const mutations: MutationTree<SnackBar> = {
  SHOW(state, payload) {
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
