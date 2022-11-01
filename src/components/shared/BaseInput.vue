<template>
  <v-text-field
    :label="label"
    outlined
    :value="modelValue"
    v-bind="{
      ...$attrs,
      onInput: updateValue($event),
    }"
  >
  </v-text-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
  },

  setup(props, { emit }) {
    const updateValue = (val: string | number) => {
      // let val = event.target.value;

      console.log("value", val);

      // if (event.target.type === "checkbox") val = event.target.checked;
      // if (event.target.type === "radio") val = props.value;

      emit("input", val);
    };

    return {
      updateValue,
    };
  },
});
</script>
