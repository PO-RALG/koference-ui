<template>
  <div id="inspire">
    <Sidebar
      @sidebarToggle="toggleDrawer"
      :drawer="data.drawer"
      :user="user"
      class="d-print-none"
    />
    <Header
      @logoutFunction="logout"
      @sidebarToggle="toggleDrawer"
      :user="user"
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
import { defineComponent, reactive, onMounted } from "vue";
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
    let data = reactive({
      drawer: isOpen,
      currentUser: null,
    });

    // methods

    const toggleDrawer = () => {
      data.drawer
        ? store.dispatch("Drawer/CLOSE")
        : store.dispatch("Drawer/OPEN");
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

      toggleDrawer,
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
