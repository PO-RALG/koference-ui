<template>
  <v-app justify-center class="grey lighten-3 pa-2 text-center main-body" fluid fill-height>
    <v-layout justify-center align-center class="body_bg">
      <v-main align="center" justify="center">
        <v-row align="center" justify="center">
          <v-col cols="8" sm="8" md="7">
            <v-card height="fit" class="elevation-8 pa-0">
              <v-row dense class="mr-0 ml-0" v-if="data.slides.length > 0">
                <!-- class="d-none d-md-flex d-lg-none d-none d-lg-flex d-xl-none d-none " -->
                <v-col md="6" cols="12" sm="12" class="pa-0">
                  <v-carousel
                    cycle
                    hide-delimiters
                    interval="10000"
                    height="100%"
                    light>
                    <v-carousel-item
                      v-for="(item, i) in data.slides"
                      :key="i"
                      :src="item.src">
                    </v-carousel-item>
                  </v-carousel>
                </v-col>
                <!-- login form start -->
                <v-col md="6" cols="12" sm="12">
                  <!-- <v-col cols="12" md="4" sm="12"> -->
                  <v-card-text class>
                    <img :src="data.coat" class="login-logo" />
                    <v-alert
                      v-if="$route.query.redirect"
                      dismissible
                      color="cyan"
                      border="left"
                      elevation="2"
                      colored-border
                      icon="mdi-alert-outline"
                    >
                      You must be logged in to access
                      {{ $route.query.redirect }}
                    </v-alert>
                    <h2 class="text-center pa-6 login-header" color="primary">LOGIN to your account</h2>
                    <h4 class="siteName pa-0 pb-4" v-if="isDemo()">({{ data.siteName }})</h4>
                    <v-form ref="form" v-model="data.valid">
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
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="mr-3 ml-3 pr-6 pl-6 pt-0">
                    <small class="text-center mt-3"> <a href="#">FOGOT PASSWORD?</a></small>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" class="white--text" @click="login" :loading="data.loading">
                      <v-icon left>mdi-login</v-icon>LOGIN
                    </v-btn>
                  </v-card-actions>
                </v-col>
                <!-- login form end -->
              </v-row>
            </v-card>
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
      errorMessage: "",
      loading: false,
      logo: "/brand.png",
      coat: "/coat_of_arms.svg.png",
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
      slides: [{ src: "/callcenter.jpeg" }],
      email: "",
      emailRules: [
        (v: any) => !!v || "Email is required",
        (v: any) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be a valid email",
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

    const login = () => {
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
      login,
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
  background-image: url(/sisbackground.jpg) !important;
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
  border-top: solid 5px #107b72;
}

.bdw {
  border-bottom: solid 2px #136d38;
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
</style>
