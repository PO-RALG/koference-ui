<template>
  <div>
    <v-select
      :items="items"
      :label="label"
      :value="value"
      :item-value="itemValue"
      :item-text="itemText"
      v-bind="{
      ...$attrs,
      }"
      @change="$emit('input', $event)"
      >
    </v-select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    label: {
      type: String,
      default: "Select",
    },
    value: {
      required: false,
    },
    itemText: {
      required: false,
      default: "name",
      type: String,
    },
    itemValue: {
      required: false,
      default: "id",
    },
    items: {
      type: Array,
      required: true,
    },
  },
});
</script>
