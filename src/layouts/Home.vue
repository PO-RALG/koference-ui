<template>
  <v-app class="grey light-4">
    <v-main class="mx-4">
      <router-view></router-view>
    </v-main>
    <Landing :user="currentUser" />
    <SnackBar />
    <LoginDialog />
  </v-app>
</template>

<script lang="ts">
import { reactive, defineComponent, onMounted, computed } from "@vue/composition-api";
import store from "@/store";
import axios from "axios";

import Landing from "@/layouts/Landing.vue";
import SnackBar from "@/components/shared/SnackBar.vue";
import LoginDialog from "@/components/auth/LoginDialog.vue";

export default defineComponent({
  components: {
    Landing,
    SnackBar,
    LoginDialog,
  },
  setup() {
    const data = reactive({
      drawer: null,
      axiosInterceptor: null,
      isLoading: false,
    });

    const currentUser = computed(() => {
      return store.getters["Auth/getCurrentUser"];
    });

    onMounted(() => {
      enableInterceptor();
    });

    const enableInterceptor = () => {
      data.axiosInterceptor = axios.interceptors.request.use(
        (config) => {
          data.isLoading = true;
          return config;
        },
        (error) => {
          data.isLoading = false;
          return Promise.reject(error);
        }
      );

      axios.interceptors.response.use(
        (response) => {
          data.isLoading = false;
          return response;
        },
        (error) => {
          data.isLoading = false;
          return Promise.reject(error);
        }
      );
    };

    const disableInterceptor = () => {
      axios.interceptors.request.eject(data.axiosInterceptor);
    };

    return {
      data,
      currentUser,

      enableInterceptor,
      disableInterceptor,

      onMounted,
    };
  },
});
</script>

<style lang="scss">
@media print {
  #content {
    padding: 0 !important;
  }
}
</style>
