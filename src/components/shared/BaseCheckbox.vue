<template>
  <v-checkbox
    :value="item"
    @change="$emit('update:value', $event.target.value)"
  >
  </v-checkbox>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    item: {
      required: true,
    },
  },
});
</script>
