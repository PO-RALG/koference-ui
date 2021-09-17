<template>
  <!-- login form start -->
  <Modal :modal="show" :width="600">
    <template v-slot:header>
      <ModalHeader :title="message" />
    </template>
    <template v-slot:body>
      <v-flex>
        <!-- <v-col cols="12" md="4" sm="12"> -->
        <v-card-text class>
          <v-alert color="warning" border="left" elevation="2" colored-border icon="mdi-alert-outline">
            Please type in your password & email to login again
          </v-alert>
          <v-form ref="form" v-model="data.valid">
            <v-text-field
              prepend-inner-icon="mdi-account-box"
              label="Email"
              v-model="data.email"
              v-bind:rules="data.emailRules"
              required
              class="mr-3 ml-3"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-key-variant"
              label="Password"
              v-model="data.password"
              v-bind:rules="data.passwordRules"
              v-bind:type="'password'"
              required
              class="mr-3 ml-3"
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-flex>
    </template>
    <!-- login form end -->
    <template v-slot:footer>
      <ModalFooter>
        <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
        <v-btn color="primary" class="white--text" @click="login" :loading="data.loading">
          <v-icon left>mdi-login</v-icon>LOGIN
        </v-btn>
      </ModalFooter>
    </template>
  </Modal>
</template>

<script lang="ts">
import Vue from "vue";
import { reactive, onMounted, computed } from "@vue/composition-api";
import { authenticate, setUser } from "./services";
import { AxiosResponse } from "axios";
import store from "@/store";
import router from "@/router";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("LoginDialog");

export default Vue.extend({
  setup(props) {
    const query = props.query;
    let data = reactive({
      valid: true,
      show: true,
      errorMessage: "",
      loginMessage: "",
      loading: false,
      email: "",
      emailRules: [
        (v: any) => !!v || "Email is required",
        (v: any) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be a valid email",
      ],
      password: "",
      passwordRules: [(v: any) => !!v || "Password is required"],
    });

    let { show } = useState(["show"]);

    onMounted(() => {
      const { message, path } = store.getters["LoginDialog/getStatus"];
      data.loginMessage = message;
    });

    const message = computed(() => {
      let info = data.loginMessage ? `Your ${data.loginMessage}` : `Your token has expired`;
      return info.toUpperCase();
    });

    const login = () => {
      const payload = {
        email: data.email,
        password: data.password,
      };

      authenticate(payload).then((response: AxiosResponse) => {
        if (response.status === 200) {
          setUser(response.data.data.user);
          cancelDialog();
          router.go(0);
          store.dispatch("LoginDialog/DONE");
        }
      });
    };

    const cancelDialog = () => {
      data.show = !data.show;
    };

    return {
      login,
      data,
      message,
      cancelDialog,
      show,
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
</style>
