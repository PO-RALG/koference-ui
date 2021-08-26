<template>
  <v-card-title class="">
    <span class="text-h5">{{ title }}</span>
  </v-card-title>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>
