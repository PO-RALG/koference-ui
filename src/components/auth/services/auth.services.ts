import axios from "axios";
import store from "@/store";
import _ from "lodash";

const authenticate = async (payload: any) => {
  return axios.post("/api/v1/login", payload);
};

const setUser = async (payload: any) => {
  // rename menu to menu_groups and menu's menu to children
  const data = payload.menu.map(({ menu, ...item }) => ({ ...item, children: menu }));

  const sorted = _.sortBy(data, "position");

  payload.menu_groups = data;
  // delete menu
  delete payload.menu;
  const user = JSON.stringify(payload);
  store.dispatch("Auth/LOGIN", user);
};

const setLoginError = async () => {
  store.dispatch["Auth/AUTHENTICATE"];
};

export { authenticate, setUser, setLoginError };
