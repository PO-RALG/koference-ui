import axios from "axios";
import store from "@/store";
import _ from "lodash";

const authenticate = async (payload: any) => {
  return axios.post("/api/v1/login", payload);
};

const uploadFile = async (payload: any) => {
  // console.log("upload", payload);
  return axios.post("/api/v1/files/upload", payload);
};

const changePassword = async (payload: any) => {
  return axios.post("/api/v1/users/change-password", payload);
};

const createData = async (payload: any) => {
  return axios.post("/api/v1/queries", payload);
};

const openFile = async (payload: any) => {
  return axios.post("/api/v1/filelinks", payload);
};

const sendFeedbackData = async (payload: any) => {
  return await axios.patch(`/api/v1/queries/` + payload.query.id, payload);
};
const setUser = async (payload: any) => {
  console.log("user", payload.data);
  // rename menu to menu_groups and menu's menu to children
  const data = payload.data.menus.map(({ menu, ...item }) => ({
    ...item,
    // children: menu,
  }));

  const sorted = _.sortBy(data, "description");

  const newMenuGroup = [
    {
      id: 0,
      name: "Dashboard",
      state: "/",
      url: "/",
      icon: "mdi-home",
      code: "10024",
      created_by: null,
    },
    ...sorted,
  ];

  payload.data.menu_groups = newMenuGroup;
  // delete menu
  delete payload.data.menus;

  console.log("payload", payload);

  const user = JSON.stringify(payload.data);
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
  changePassword,
  getAppName,
  getAppRoutes,
  setAppName,
  setLoginError,
  setUser,
  uploadFile,
  createData,
  sendFeedbackData,
  openFile,
};
