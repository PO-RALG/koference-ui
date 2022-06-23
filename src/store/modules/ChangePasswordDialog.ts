import { ActionTree, GetterTree, MutationTree } from "vuex";
import { RootState } from "../types";
import { ChangePassword } from "./types";

const state: ChangePassword = {
  show: false,
  message: null,
  requestsPending: 0,
};

const getters: GetterTree<ChangePassword, RootState> = {
  isVisible(state): boolean {
    return state.show;
  },

  getStatus(state: ChangePassword) {
    return { show: state.show, message: state.message };
  },
};

const actions: ActionTree<ChangePassword, RootState> = {
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

const mutations: MutationTree<ChangePassword> = {
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
      this.commit("ChangePasswordDialog/SHOW");
    }

    state.requestsPending++;
  },

  DONE(state) {
    if (state.requestsPending >= 1) {
      state.requestsPending--;
    }

    if (state.requestsPending <= 0) {
      this.commit("ChangePasswordDialog/HIDE");
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
