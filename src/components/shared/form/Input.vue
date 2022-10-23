<template>
  <div>
    <v-text-field
      v-bind="$attrs"
      :label="label"
      :value="value"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
  },
});
</script>
