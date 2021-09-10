import axios from "axios";
import store from "@/store";

const authenticate = async (payload: any) => {
  return axios.post("/api/v1/login", payload);
};

const setUser = async (payload: any) => {
  const user = JSON.stringify(payload);
  store.dispatch("Auth/LOGIN", user);
};

const setLoginError = async () => {
  store.dispatch["Auth/AUTHENTICATE"];
};

export { authenticate, setUser, setLoginError };
