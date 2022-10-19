<template>
  <v-app
    justify-center
    class="grey lighten-3 pa-0 text-center main-body"
    fluid
    fill-height
  >
    <v-snackbar
      class="mt-12 d-none d-md-flex d-lg-none d-none d-lg-flex"
      :timeout="6000000"
      shaped
      :top="true"
      color="#1476d7"
      left
      clearable
      v-model="data.showInfo"
    >
      <v-icon x-large color="white"> mdi-hand-pointing-right </v-icon>
      <a href="http://197.149.179.125/" target="_blank">
        <span class="white--text">
          <em>Bofya hapa kuingia katika toleo la zamani (FFARS v 1.0) </em>
        </span>
      </a>
    </v-snackbar>
    <v-layout justify-center align-center class="body_bg">
      <v-main align="center" justify="center">
        <v-row align="center" justify="center">
          <v-col cols="8" sm="8" md="7">
            <v-row class="mb-0 pa-0" justify="center">
              <v-col md="auto">
                <v-flex class="col-md12">
                  <v-row class="mb-0 pa-0" justify="center" no-gutters>
                    <h4 class="white--text">
                      <strong>
                        {{ "THE UNITED REPUBLIC OF TANZANIA" }}
                      </strong>
                    </h4>
                  </v-row>
                  <h4 class="white--text">
                    {{
                      "FACILITY FINANCIAL ACCOUNTING AND REPORTING SYSTEM (FFARS)"
                    }}
                  </h4>
                </v-flex>
              </v-col>
            </v-row>
            <v-card height="fit" class="elevation-8 pa-n16">
              <v-row
                dense
                class="mr-0 ml-0 mr-0 ml-0"
                v-if="data.slides.length > 0"
              >
                <!-- class="d-none d-md-flex d-lg-none d-none d-lg-flex d-xl-none d-none " -->
                <v-col
                  md="6"
                  cols="12"
                  sm="12"
                  class="d-none d-md-flex d-lg-none d-none d-lg-flex"
                >
                  <v-carousel
                    cycle
                    hide-delimiters
                    interval="10000"
                    height="100%"
                    light
                  >
                    <v-carousel-item
                      v-for="(item, i) in data.slides"
                      :key="i"
                      :src="item.src"
                    >
                    </v-carousel-item>
                  </v-carousel>
                </v-col>
                <!-- login form start -->
                <v-col md="6" cols="12" sm="12">
                  <!-- <v-col cols="12" md="4" sm="12"> -->
                  <v-card-text class>
                    <v-row class="mb-0 pa-0" justify="center" no-gutters>
                      <img :src="data.coat" class="login-logo"
                    /></v-row>
                    <h2 class="text-center pa-6 login-header" color="primary">
                      LOGIN to your account
                    </h2>
                    <v-row class="mb-0 pa-0" justify="center" no-gutters>
                      <h4 class="siteName pa-0 pb-4">({{ data.siteName }})</h4>
                    </v-row>
                    <v-form
                      ref="form"
                      v-model="data.valid"
                      @submit.prevent="loginUser"
                    >
                      <v-text-field
                        prepend-inner-icon="mdi-account-box"
                        label="Email"
                        v-model="data.email"
                        v-bind:rules="data.emailRules"
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
                        <v-btn
                          x-small
                          class="mx-2 d-none d-sm-flex ml-0"
                          fab
                          outlined
                          dark
                          color="primary"
                        >
                          <a href="http://196.192.73.13/docs" target="_blank">
                            <v-icon small color="primary">mdi-help</v-icon>
                          </a>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          class="white--text"
                          type="submit"
                          :disabled="!data.valid || data.loading"
                          :loading="data.loading"
                        >
                          <v-icon left>mdi-login</v-icon>LOGIN
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card-text>
                </v-col>
                <!-- login form end -->
              </v-row>
            </v-card>
            <div class="pt-5">
              <v-row class="mb-6 pa-0" justify="center" no-gutters>
                <small class="white--text">
                  {{ "Copyright" }}
                </small>
                <small class="white--text">
                  {{ " ©2022 PORALG" }}
                </small>
                <small class="white--text">
                  {{ ". All right reserved." }}
                </small>
                <small class="white--text">
                  <strong>{{ " FFARS v 2.0 ." }}</strong>
                </small>
                <small class="white--text">
                  {{
                    "For any Technical inquiry, please contact your ICT Support Team ."
                  }}
                </small>
              </v-row>
              <v-row class="mb-n8 pa-0" justify="center" no-gutters> </v-row>
            </div>
          </v-col>
          <v-col cols="8" sm="8" md="7">
            <div class="text-center"></div>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { reactive, onMounted } from "@vue/composition-api";
import { authenticate, setUser, getAppName, setAppName } from "./services";
import { AxiosResponse } from "axios";
import router from "@/router";

export default Vue.extend({
  props: ["source", "query"],

  setup(props) {
    const query = props.query;

    let data = reactive({
      model: 0,
      siteName: "",
      valid: true,
      showInfo: true,
      errorMessage: "",
      loading: false,
      logo: "/brand.png",
      coat: "/coat_of_arms.svg.png",
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
      slides: [{ src: "/corona.jpeg" }, { src: "/callcenter.jpeg" }],
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

    onMounted(() => {
      getAppName().then((response) => {
        setAppName(response.data.data);
        data.siteName = response.data.data;
      });
    });

    const loginUser = () => {
      const payload = {
        email: data.email,
        password: data.password,
      };

      authenticate(payload).then((response: AxiosResponse) => {
        let redirectUrl = query["redirect"] || "/";
        if (response.status === 200) {
          setUser(response.data.data.user);
          router.push(redirectUrl);
        } else {
          router.push("/login");
        }
      });
    };

    return {
      loginUser,
      data,
    };
  },
});
</script>

<style scoped>
.coat {
  width: 100px;
  height: 100px;
}
.main-body {
  background: #ccc !important;
}
.body_bg {
  /* background-image: url("@/assets/ffars_background.jpg") !important; */
  background-color: #054c97;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center center !important; /* optional, center the image */
}
.v-responsive__sizer {
  padding-bottom: 85% !important;
}
.wrapper {
  padding: 0 !important;
}
.img_top {
  border-style: none;
  height: 60px;
  padding-bottom: 5px;
}
.img_slides {
  height: inherit;
  width: inherit;
}
.bdt {
  border-top: solid 5px #1476d7;
}

.bdw {
  border-bottom: solid 2px #1476d7;
}
.login-logo {
  border-radius: 50%;
  height: 100px;
  width: 100px;
  border: 4px solid #ccc;
}
.login-header {
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
}
.v-sheet {
  padding: 10px;
}
h4.siteName {
  text-transform: uppercase;
  color: red;
  font-weight: bold;
}
a {
  text-decoration: none;
}
</style>
