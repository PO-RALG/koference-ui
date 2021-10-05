<template>
  <div id="inspire">
    <Sidebar
      :drawer="data.drawer"
      @toggle="toggleSidebar"
      :user="user"
      class="d-print-none"
    />
    <Header
      @logoutFunction="logout"
      @sidebarToggle="toggleSidebar"
      :drawer="data.drawer"
      class="d-print-none"
    />
    <v-main>
      <v-container class="fill-height" fluid>
        <v-layout> </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState } = createNamespacedHelpers("Drawer");
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
    let { isOpen } = useState(["isOpen"]);
    // state  => formally data
    let data = reactive({
      drawer: isOpen,
      currentUser: null,
    });

    // methods
    const toggleSidebar = (drawer: boolean) => {
      data.drawer ? store.dispatch("Drawer/CLOSE") : store.dispatch("Drawer/OPEN");
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

<style lang="scss">
@media print {
  #content {
    padding: 0 !important;
  }
}
</style>
