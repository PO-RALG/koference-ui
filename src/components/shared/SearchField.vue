<template>
  <v-text-field
    append-icon="mdi-magnify"
    :label="label"
    :items="items"
    @keyup="search($event)"
    outlined
    hide-details
  ></v-text-field>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
export default defineComponent ({
  props: {
    label: {
      type: String,
      required: false,
    },
    items: {
      type: Array,
      required: true,
    },
    filterFunction: { type: Function },
  },

  setup(_props, { emit }) {
    const search = (event) => {
      emit("filterFunction", event.target.value);
    };

    return {
      search,
    };
  },
});
</script>
