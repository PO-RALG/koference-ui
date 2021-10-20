import axios from "axios";
import store from "@/store";
import _ from "lodash";

const authenticate = async (payload: any) => {
  return axios.post("/api/v1/login", payload);
};

const changePassword = async (payload: any) => {
  return axios.post("/api/v1/users/change-password", payload);
};

const setUser = async (payload: any) => {
  // rename menu to menu_groups and menu's menu to children
  const data = payload.menu.map(({ menu, ...item }) => ({ ...item, children: menu }));

  const sorted = _.sortBy(data, "position");

  payload.menu_groups = sorted;
  // delete menu
  delete payload.menu;
  const user = JSON.stringify(payload);
  store.dispatch("Auth/LOGIN", user);
};

const setLoginError = async () => {
  store.dispatch["Auth/AUTHENTICATE"];
};

const setAppName = (payload: string) => {
  store.dispatch("Auth/APP_NAME", payload);
};

const getAppName = async () => {
  return axios.get("/api/v1/app-name");
};

const getAppRoutes = async () => {
  return axios.get("/api/v1/app-routes");
};

export {
  authenticate,
  setUser,
  setLoginError,
  getAppName,
  getAppRoutes,
  setAppName,
  changePassword,
};
