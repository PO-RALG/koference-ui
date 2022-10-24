<template>
  <v-text-field
    v-bind="$attrs"
    append-icon="mdi-magnify"
    :label="label"
    :items="items"
    @keyup="search($event)"
    @click:clear="clear"
    autocomplete="off"
    outlined
    hide-details
  ></v-text-field>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    label: {
      type: String,
      required: false,
    },
    items: {
      type: Array,
      required: false,
    },
    filterFunction: { type: Function },
    clearFn: {
      type: Function,
    },
  },

  setup(_props, { emit }) {
    const search = (event) => {
      emit("filterFunction", event.target.value);
    };

    const clear = () => {
      emit("searchFn");
    };

    return {
      search,
      clear,
    };
  },
});
</script>
