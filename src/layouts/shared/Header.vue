<template>
  <v-app-bar app color="primary">
    <v-app-bar-nav-icon v-if="!drawer" @click.stop="toggleSidebar" color="white" large />
    <v-toolbar-title class="header-toolbar"></v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    logoutFunction: {
      type: Function,
      required: false,
    },
    sidebarToggle: {
      type: Function,
      required: false,
    },
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {
    // methods
    const toggleSidebar = () => {
      context.emit("sidebarToggle", props.drawer);
    };

    const logout = () => {
      context.emit("logoutFunction", true);
    };

    return {
      toggleSidebar,
      logout,
    };
  },
});
</script>

<style lang="scss">
.header-toolbar {
  color: #fff;
  background-color: rgb(33, 150, 243) !important;
}
</style>
