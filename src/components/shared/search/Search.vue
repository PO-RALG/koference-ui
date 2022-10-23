<template>
  <v-text-field
    v-bind="$attrs"
    outlined
    :label="label"
    :value="value"
    @input="$emit('input', $event)"
    @keyup="searchFn"
    @click:clear="clearFn"
    clearable
  ></v-text-field>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      default: "",
    },
    searchFn: {
      type: Function,
      required: true,
    },
    clearFn: {
      type: Function,
      required: true,
    },
    value: {
      type: [String, Number],
      default: "",
    },
  },
});
</script>
