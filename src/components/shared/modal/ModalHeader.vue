<template>
  <v-card-title :class="!showTitleBg ? 'primary white--text pa-4' : 'pa-4'">
    <span class="text-h5">{{ title }}</span>
  </v-card-title>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    showTitleBg: {
      type: Boolean,
      default: false,
      required: false,
    }
  },
});
</script>
