<template>
  <!-- login form start -->
  <Modal :modal="show" :width="600">
    <template v-slot:header>
      <ModalHeader :title="message" />
    </template>
    <template v-slot:body>
      <v-flex>
        <!-- <v-col cols="12" md="4" sm="12"> -->
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="data.valid">
            <v-text-field
              label="Enter Current Password"
              v-model="data.current_password"
              v-bind:rules="data.passwordRules"
              v-bind:type="'password'"
              outlined
              required
              class="mr-0 ml-0"
            ></v-text-field>
            <v-text-field
              label="Enter New Password"
              v-model="data.password"
              v-bind:rules="data.newPasswordRules"
              v-bind:type="'password'"
              outlined
              required
              class="mr-0 ml-0"
            ></v-text-field>
            <v-text-field
              label="New Password Confirmation "
              v-model="data.password_confirmation"
              :rules="data.passwordConfirmationRules"
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
        <v-btn color="blue darken-1" :disabled="true" text @click="cancelDialog"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          :disabled="!data.valid"
          class="white--text mr-2 mb-4"
          @click="changePass"
          :loading="data.loading"
        >
          <v-icon left>mdi-login</v-icon>Change Password
        </v-btn>
      </ModalFooter>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useChangePasswordDialog } from "./composables/change-password";

export default defineComponent({
  setup() {
    const {
      changePass,
      data,
      message,
      cancelDialog,
      show,
      passwordConfirmationRule,
    } = useChangePasswordDialog();
    return {
      changePass,
      data,
      message,
      cancelDialog,
      show,
      passwordConfirmationRule,
    };
  },
});
</script>

<style scoped>
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
