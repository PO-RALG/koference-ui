<template>
  <p aria-live="assertive" class="errorMessage" :id="id">
    <slot />
  </p>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
});
</script>
