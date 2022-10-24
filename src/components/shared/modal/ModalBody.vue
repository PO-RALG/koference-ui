<template>
  <v-card-text class="pa-4">
    <v-container>
      <slot />
    </v-container>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style lang="scss">
.container {
  padding: 6px 6px 0 6px;
}
</style>
