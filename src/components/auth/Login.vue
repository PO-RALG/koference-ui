<template>
  <v-app justify-center class="grey lighten-3 pa-2 text-center main-body" fluid fill-height>
    <v-layout justify-center align-center class="body_bg">
      <v-content align="center" justify="center">
        <v-row align="center" justify="center">
          <v-col cols="8" sm="8" md="7">
            <v-card height="fit" class="elevation-5">
              <v-row dense class="mr-0 ml-0" v-if="data.slides.length > 0">
                <!-- class="d-none d-md-flex d-lg-none d-none d-lg-flex d-xl-none d-none " -->
                <v-flex grow md6>
                  <v-flex class="d-none d-md-flex d-lg-none d-none d-lg-flex">
                    <v-carousel
                      cycle
                      hide-delimiters
                      interval="10000"
                      height="100%"
                      light
                      hide-delimiter-background
                      show-arrows-on-hover
                    >
                      <v-carousel-item v-for="(item, i) in data.slides" :key="i" :src="item.src"></v-carousel-item>
                    </v-carousel>
                  </v-flex>
                </v-flex>
                <!-- login form start -->
                <v-flex md6 sm12>
                  <!-- <v-col cols="12" md="4" sm="12"> -->
                  <v-card-text class>
                    <img :src="data.coat" class="login-logo" />
                    <h2 class="text-center pa-6 login-header" color="primary">LOGIN to your account</h2>
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
                </v-flex>
                <!-- login form end -->
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-content>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { reactive } from "@vue/composition-api";
import { authenticate } from "./services";

export default Vue.extend({
  props: {
    source: String,
  },

  setup() {
    let data = reactive({
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
        (v: any) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be a valid email",
      ],
      password: "",
      passwordRules: [(v: any) => !!v || "Password is required"],
    });

    const login = () => {
      const payload = {
        email: data.email,
        password: data.password,
      };

      authenticate(payload).then((response) => {
        console.log("response", response);
      });
    };

    return {
      login,
      data,
    };
  },
});
</script>

<style>
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
</style>
