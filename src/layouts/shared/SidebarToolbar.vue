<template>
  <v-toolbar-title
    color=""
    class="sidebar-toolbar d-flex flex-row justify-space-between"
  >
    <h3 class="admin-title">GRM</h3>
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
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    onSidebarClose: {
      type: Function,
    },
  },
});
</script>
