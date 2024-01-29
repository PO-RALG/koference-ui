<template>
  <v-toolbar-title
    color=""
    class="sidebar-toolbar d-flex flex-row justify-space-between"
  >
    <h3 class="admin-title">IPHC CONFERENCE</h3>
    <v-icon
      large
      @click.stop="$emit('onSidebarClose')"
      color="white"
      class="sidebar-close-icon"
      >mdi-close</v-icon
    >
    <div class="backdrop" @click.stop="$emit('onSidebarClose')"></div>
  </v-toolbar-title>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    onSidebarClose: {
      type: Function,
    },
  },
});
</script>
<style>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: none;
}

/* Show the backdrop when the drawer is open */
.v-navigation-drawer[value="true"] + .backdrop {
  display: block;
}
</style>
