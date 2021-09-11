<template>
  <div>
    <v-snackbar
      v-for="(snackbar, index) in snackbars.filter((s) => s.showing)"
      :key="snackbar.text + Math.random()"
      v-model="snackbar.showing"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      :style="`bottom: ${index * 60 + 8}px`"
    >
      {{ snackbar.text }}

      <v-btn text @click="snackbar.showing = false"> Close </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import store from "@/store";

export default defineComponent({
  setup() {
    const snackbars = computed(() => store.state.snackbar);

    return {
      snackbars,
    };
  },
});
</script>

<style lang="scss" scoped></style>
