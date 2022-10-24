<template>
  <VTextField
    ref="input"
    v-currency="options"
    :value="formattedValue"
    @change="onChange"
    @input="onInput"
  />
</template>

<script>
import { reactive, defineComponent, onMounted, watch, ref } from "vue";
export default defineComponent({
  name: "VCurrencyField",
  props: {
    value: {
      type: Number,
      default: null,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },

  setup(props, context) {
    const data = reactive({
      formattedValue: null,
    });

    onMounted(() => {
      setValue(props.value);
    });

    watch(
      () => props.value,
      (newValue) => {
        setValue(newValue);
      }
    );

    const setValue = (value) => {
      this.$ci.setValue(this.$refs.input, value);
    };

    const onInput = (value) => {
      context.emit("input", this.$ci.getValue(this.$refs.input));
      this.formattedValue = value;
    };

    const onChange = (value) => {
      this.$emit("change", this.$ci.getValue(this.$refs.input));
      this.formattedValue = value;
    };

    return {
      data,
      setValue,
      onInput,
      onChange,
    };
  },
});
</script>
