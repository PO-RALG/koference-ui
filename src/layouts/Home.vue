<template>
  <v-app class="grey light-4">
    <v-main class="mx-4">
      <router-view></router-view>
    </v-main>
    <SnackBar />
    <Landing :user="currentUser" />
    <LoginDialog />
    <ChangePasswordDialog />
  </v-app>
</template>

<script lang="ts">
import {
  reactive,
  defineComponent,
  onMounted,
  computed,
} from 'vue'
import store from '@/store'
import axios from 'axios'

import Landing from '@/layouts/Landing.vue'
import LoginDialog from '@/components/auth/LoginDialog.vue'
import ChangePasswordDialog from '@/components/auth/ChangePasswordDialog.vue'
import SnackBar from '@/components/shared/SnackBar.vue'

export default defineComponent({
  components: {
    Landing,
    LoginDialog,
    ChangePasswordDialog,
    SnackBar,
  },
  setup() {
    const data = reactive({
      drawer: null,
      axiosInterceptor: null,
      isLoading: false,
    })

    const currentUser = computed(() => {
      return store.getters["Auth/getCurrentUser"]
    })

    onMounted(() => {
      enableInterceptor();
    })

    const enableInterceptor = () => {
      data.axiosInterceptor = axios.interceptors.request.use(
        (config) => {
          data.isLoading = true
          return config
        },
        (error) => {
          data.isLoading = false
          return Promise.reject(error)
        }
      )

      axios.interceptors.response.use(
        (response) => {
          data.isLoading = false
          return response
        },
        (error) => {
          data.isLoading = false
          return Promise.reject(error)
        }
      )
    }

    const disableInterceptor = () => {
      axios.interceptors.request.eject(data.axiosInterceptor)
    }

    return {
      currentUser,
    }
  },
})
</script>

<style lang="scss">
@media print {
  #content {
    padding: 0 !important;
  }
}
</style>
