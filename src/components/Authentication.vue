<template>
  <div>
    <v-container class="mt-10">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card>
            <v-card-title class="text-h6">Login</v-card-title>
            <v-card-text>
              <v-form
                ref="form"
                v-model="$data.valid"
                @submit.prevent="loginUser"
              >
                <v-text-field
                  prepend-inner-icon="mdi-account-box"
                  label="username"
                  v-model="data.username"
                  required
                  outlined
                  class="mr-3 ml-3"
                ></v-text-field>

                <v-text-field
                  prepend-inner-icon="mdi-key-variant"
                  label="Password"
                  v-model="data.password"
                  v-bind:rules="data.passwordRules"
                  v-bind:type="'password'"
                  required
                  outlined
                  class="mr-3 ml-3"
                ></v-text-field>
                <v-card-actions class="mr-1 ml-0 mt-n4">
                  <v-btn color="#19577b" flat class="white--text">
                    <v-icon left>mdi-ask</v-icon>FORGOT YOUR PASSWORD
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="#19577b" flat class="white--text" type="submit">
                    <v-icon left>mdi-login</v-icon>LOGIN
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { reactive, onMounted } from "vue";
import { authenticate, setUser } from "./services";
import { AxiosResponse } from "axios";
import router from "@/router";

import _ from "lodash";

export default Vue.extend({
  name: "LoginComponent",

  components: {},
  props: ["source", "query"],

  setup(props) {
    const query = props.query;

    let data = reactive({
      username: "",
      password: "",
      items: [
        { title: "Lalamika", icon: "mdi-send", method: "openClaimForm" },
        { title: "Fuatilia", icon: "mdi-magnify", method: "searchQuery" },
        { title: "Ingia(Login)", icon: "mdi-login", method: "openLogin" },
      ],
      resetOption: [
        {
          title: "Namba ya utambuzi",
          icon: "mdi-magnify",
          method: "searchQuery",
        },
        {
          title: "Namba ya ufuatiliaji",
          icon: "mdi-send",
          method: "openClaimForm",
        },
      ],
      drawer: false, // Initial state of the navigation drawer
      filePreviewmodal: false,
      isClaim: false,
      toopen: "",
      retrivedUserToBind: null,
      searchUser: "",
      selectedOption: "known",
      searchTerm: "",
      searchQuery: false,
      userModal: false,
      modal: false,
      modalLogin: false,
      model: 0,
      modalTitle: "",
      siteName: "",
      valid: true,
      showInfo: true,
      errorMessage: "",
      loading: false,
      logo: "/brand.png",
      ffars_logo: "/ffars_logo.png",
      send: "/claim.jpg",
      follow: "/follow.png",
      coat: "/coat_of_arms.svg.png",
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
      slides: [{ src: "/X.jpg" }, { src: "/2.jpg" }, { src: "/1.jpg" }],

      queryCategories: [],
      documentTypes: [],
      emailRules: [
        (v: any) => !!v || "username is required",
        (v: any) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be a valid username",
      ],
      passwordRules: [(v: any) => !!v || "Password is required"],
      formData: {
        id: "",
        description: "",
        queryStatusId: 1,
        queryCategoryId: "",
        files: [],
        queryof_user_id: null,
        usersource: "Anonymous",
      },
      retrivedQuery: "",
      retrivedUser: "",
    });

    onMounted(() => {});

    const loginUser = () => {
      const payload = {
        username: data.username,
        password: data.password,
      };

      authenticate(payload).then((response: AxiosResponse) => {
        let redirectUrl = "/";
        if (response.status === 201) {
          console.log("res", response);
          // if (response.data.msg) {
          setUser(response);
          router.push("/");
          // router.push(redirectUrl);
        } else {
          // router.push("/about-page");
        }
      });
    };

    return {
      data,
      loginUser,
    };
  },
});
</script>
