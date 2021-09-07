<template>
  <v-app class="grey light-4">
    <v-content class="mx-4">
      <router-view></router-view>
    </v-content>
    <Landing :user="currentUser" />
  </v-app>
</template>

<script lang="ts">
import { reactive, defineComponent, computed } from "@vue/composition-api";
import store from "@/store";

import Landing from "@/layouts/Landing.vue";

export default defineComponent({
  components: {
    Landing,
  },
  setup() {
    const data = reactive({
      drawer: null,
    });

    const currentUser = computed(() => {
      return store.getters["Auth/getCurrentUser"];
    });

    return {
      data,
      currentUser,
    };
  },
});
</script>
