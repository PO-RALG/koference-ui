<template>
  <v-card-title
    :class="
      !showTitleBg && colour == 'red'
        ? 'red white--text pa-4'
        : ' bg_color white--text pa-4pa-4'
    "
  >
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
    colour: {
      type: String,
      required: false,
    },
    showTitleBg: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
});
</script>
<style>
.bg_color {
  background: #19577b;
}
</style>
