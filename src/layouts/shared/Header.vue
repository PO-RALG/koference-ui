<template>
  <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary" dark>
    <v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      <span class="hidden-sm-and-down">FFARS</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text color="white" value="logout" @click="logout">
      <span class=" font-weight-bold">LOGOUT</span>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
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
      context.emit("logoutFunction");
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
