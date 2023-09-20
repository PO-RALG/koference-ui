import router from "@/router";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { RootState } from "../types";
import { Auth } from "./types";

const state: Auth = {
  currentUser: JSON.parse(localStorage.getItem("GRM_USER")),
  loginError: {},
  app: JSON.parse(localStorage.getItem("GRM_APP")),
  loginStatus: JSON.parse(localStorage.getItem("GRM_LOGIN_STATUS")),
};

const getters: GetterTree<Auth, RootState> = {
  getCurrentUser: (state: Auth) => {
    return state.currentUser;
  },

  getSiteName: (state: Auth) => {
    return state.app;
  },

  getLoginStatus: (state: Auth) => {
    return state.loginStatus;
  },

  loginError: (state: Auth) => {
    return state.loginError;
  },
};

const actions: ActionTree<Auth, RootState> = {
  async LOGOUT({ commit }) {
    commit("LOG_OUT");
  },

  async APP_NAME({ commit }, payload) {
    commit("SET_APP_NAME", payload);
  },

  async LOGIN({ commit }, payload: Auth) {
    commit("AUTHENTICATE", payload);
    console.log("login", payload);
  },
};

const mutations: MutationTree<Auth> = {
  AUTHENTICATE(state, payload) {
    const loginStatus = { isLoggedIn: true };
    state.currentUser = JSON.parse(payload);
    state.loginStatus = loginStatus;
    localStorage.setItem("GRM_USER", payload);
    localStorage.setItem("GRM_LOGIN_STATUS", JSON.stringify(loginStatus));
  },

  SET_APP_NAME(state, payload) {
    const app = { name: payload };
    state.app = app;
    localStorage.setItem("GRM_APP", JSON.stringify(app));
  },

  LOG_OUT(state) {
    const loginStatus = { isLoggedIn: false };
    state.loginStatus = loginStatus;
    state.currentUser = {};
    localStorage.removeItem("GRM_USER");
    localStorage.removeItem("GRM_LOGIN_STATUS");
    router.push("/login");
  },

  SET_LOGIN_ERROR(state, error) {
    localStorage.removeItem("GRM_LOGIN_STATUS");
    localStorage.removeItem("GRM_LOGIN_STATUS");
    state.loginError = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
