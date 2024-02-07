import { reactive } from "vue";
import { authenticate, setUser } from "../services";
import { AxiosResponse } from "axios";
import router from "@/router";

export const useLogin = (): any => {
  const props = {
    source: {},
    query: {
      type: Object,
    },
  };

  const query = props.query;
  const data = reactive({
    model: 0,
    valid: true,
    errorMessage: "",
    loading: false,
    logo: "/brand.png",
    coat: "/coat_of_arms.svg.png",
    colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
    slides: [{ src: "/mobileapp.jpeg" }, { src: "/callcenter.jpeg" }],
    email: "",
    emailRules: [
      (v: any) => !!v || "Email is required",
      (v: any) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be a valid email",
    ],
    password: "",
    passwordRules: [(v: any) => !!v || "Password is required"],
  });

  const login = () => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    authenticate(payload).then((response: AxiosResponse) => {
      const redirectUrl = props.query["redirect"] || "/";
      if (response.status === 200) {
        setUser(response.data.data.user);
        router.push(redirectUrl);
      } else {
        router.push("/login");
      }
    });
  };

  return {
    login,
    data,
    query,
  };
};
