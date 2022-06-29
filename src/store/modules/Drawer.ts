import { ActionTree, GetterTree, MutationTree } from "vuex";
import { RootState } from "../types";
import { Drawer } from "./types";

const state: Drawer = {
  isOpen: true,
};

const getters: GetterTree<Drawer, RootState> = {
  IS_OPEN(state): boolean {
    return state.isOpen;
  },
};

const actions: ActionTree<Drawer, RootState> = {
  OPEN({ commit }) {
    commit("OPEN");
  },

  CLOSE({ commit }) {
    commit("CLOSE");
  },
};

const mutations: MutationTree<Drawer> = {
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
