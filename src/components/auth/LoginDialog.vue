<template>
  <!-- login form start -->
  <Modal :modal="show" :width="600">
    <template v-slot:header>
      <ModalHeader :title="message" :colour="`red`" />
    </template>
    <template v-slot:body>
      <v-flex>
        <!-- <v-col cols="12" md="4" sm="12"> -->
        <v-card-text class="pa-6">
          <v-alert
            width="100%"
            color="warning"
            border="left"
            elevation="2"
            colored-border
            icon="mdi-alert-outline"
          >
            Please type in your password & email to login again
          </v-alert>
          <v-form ref="form" v-model="data.valid">
            <v-text-field
              prepend-inner-icon="mdi-account-box"
              label="Username"
              v-model="data.username"
              outlined
              required
              class="mr-0 ml-0"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-key-variant"
              label="Password"
              v-model="data.password"
              v-bind:rules="data.passwordRules"
              v-bind:type="'password'"
              outlined
              required
              class="mr-0 ml-0"
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-flex>
    </template>
    <!-- login form end -->
    <template v-slot:footer>
      <ModalFooter class="mt-n8">
        <v-btn color="red" class="white--text mr-2 mb-4" @click="cancelDialog"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          class="white--text mr-2 mb-4"
          @click="login"
          :loading="data.loading"
        >
          <v-icon left>mdi-login</v-icon>LOGIN
        </v-btn>
      </ModalFooter>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLoginDialog } from "./composables/use-login-dialog";

export default defineComponent({
  setup() {
    const { login, data, message, cancelDialog, show } = useLoginDialog();
    return { login, data, message, cancelDialog, show };
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
  background-image: url("@/assets/ffars_background.jpg") !important;
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
