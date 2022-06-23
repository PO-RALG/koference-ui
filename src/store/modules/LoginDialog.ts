import { ActionTree, GetterTree, MutationTree } from "vuex";
import { RootState } from "../types";
import { LoginDialog } from "./types";

const state: LoginDialog = {
  show: false,
  message: null,
  requestsPending: 0,
};

const getters: GetterTree<LoginDialog, RootState> = {
  isVisible(state) {
    return state.show;
  },

  getStatus(state) {
    return { show: state.show, message: state.message };
  },
};

const actions: ActionTree<LoginDialog, RootState> = {
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

const mutations: MutationTree<LoginDialog> = {
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
      this.commit("LoginDialog/SHOW");
    }

    state.requestsPending++;
  },

  DONE(state) {
    if (state.requestsPending >= 1) {
      state.requestsPending--;
    }

    if (state.requestsPending <= 0) {
      this.commit("LoginDialog/HIDE");
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
