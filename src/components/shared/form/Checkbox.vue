<template>
  <div>
    <v-checkbox
      :label="label"
      v-bind="{
        ...$attrs,
      }"
      :value="modelValue"
      @change="() => $emit('input', $event)"
    >
    </v-checkbox>
    <BaseErrorMessage v-if="error" :id="`${uuid}-error`">
      {{ error }}
    </BaseErrorMessage>
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
    modelValue: {
      type: Boolean,
    },
    error: {
      type: String,
      default: "",
    },
  },
});
</script>
