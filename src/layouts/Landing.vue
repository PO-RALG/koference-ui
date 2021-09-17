<template>
  <div id="inspire">
    <Sidebar :drawer="data.drawer" @toggle="toggleSidebar" :user="user" />
    <Header @logoutFunction="logout" @sidebarToggle="toggleSidebar" :drawer="data.drawer" />
    <v-content>
      <v-container class="fill-height" fluid>
        <v-layout>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import store from "@/store";

import Sidebar from "./shared/Sidebar.vue";
import Header from "./shared/Header.vue";

export default defineComponent({
  components: {
    Sidebar,
    Header,
  },
  props: {
    user: Object,
  },
  setup() {
    // state  => formally data
    let data = reactive({
      drawer: true,
      currentUser: null,
    });

    // methods
    const toggleSidebar = (drawer: boolean) => {
      data.drawer = !drawer;
    };

    const logout = () => {
      store.dispatch("Auth/LOGOUT");
    };

    // lifecycle hooks
    onMounted(() => {
      //console.log("drawer on mounted", data.drawer);
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
