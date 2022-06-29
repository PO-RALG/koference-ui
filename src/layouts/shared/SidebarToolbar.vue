<template>
  <v-toolbar-title
    color="primary"
    class="sidebar-toolbar d-flex flex-row justify-space-between"
  >
    <h3 class="admin-title">FFARS</h3>
    <v-icon
      large
      @click.stop="$emit('onSidebarClose')"
      color="white"
      class="sidebar-close-icon"
      >mdi-close</v-icon
    >
  </v-toolbar-title>
</template>
<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    onSidebarClose: {
      type: Function,
    },
  },
});
</script>
