<template>
  <v-app class="grey light-4">
    <v-content class="mx-4">
      <router-view></router-view>
    </v-content>
    <Landing />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { reactive } from "@vue/composition-api";

import Landing from "@/layouts/Landing.vue";

export default Vue.extend({
  components: {
    Landing,
  },
  setup() {
    const data = reactive({
      drawer: null,
    });

    return {
      data,
    };
  },
});
</script>
