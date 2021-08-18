<template>
  <div id="inspire">
    <Sidebar :drawer="data.drawer" @toggle="toggleSidebar" />
    <Header
      @logoutFunction="logout"
      @sidebarToggle="toggleSidebar"
      :drawer="data.drawer"
    />
    <v-content>
      <v-container class="fill-height" fluid>
        <v-layout></v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { reactive, onMounted } from "@vue/composition-api";

import Sidebar from "./shared/Sidebar.vue";
import Header from "./shared/Header.vue";

export default Vue.extend({
  components: { Sidebar, Header },

  setup() {
    // state  => formally data
    let data = reactive({
      drawer: true,
    });

    // methods
    const toggleSidebar = (drawer: boolean) => {
      data.drawer = !drawer;
    };

    const logout = (logout: boolean) => {
      console.log("logout", logout);
    };

    // lifecycle hooks
    onMounted(() => {
      console.log("drawer on mounted", data.drawer);
    });

    return {
      data,

      toggleSidebar,
      logout,

      onMounted,
    };
  },
});
</script>
