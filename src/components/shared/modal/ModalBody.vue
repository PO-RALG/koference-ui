<template>
  <v-card-text>
    <v-container>
      <slot />
    </v-container>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({});
</script>

<style lang="scss">
.container {
  padding: 0;
}
</style>
