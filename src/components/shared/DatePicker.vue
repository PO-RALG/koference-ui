<template>
  <v-layout row wrap>
    <v-menu
      v-model="data.showMenu"
      :close-on-content-click="true"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :label="label"
          prepend-icon="mdi-calendar-range"
          readonly
          :value="value"
          :error-messages="errors"
          v-bind="attrs"
          v-on="on"
        >
        </v-text-field>
      </template>
      <v-date-picker
        locale="en-in"
        :value="value"
        :max="max"
        :min="min"
        no-title
        @change="$emit('input', $event)"
      ></v-date-picker>
    </v-menu>
  </v-layout>
</template>

<script>
import { defineComponent, reactive } from "@vue/composition-api";
export default defineComponent({
  props: {
    value: {
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    max: {
      required: false,
    },
    min: {
      required: false,
    },
    errors: {
      type: Array,
    },
    dateSelectionEvent: {
      type: Function,
      required: false,
    },
    selectionType: {
      type: String,
      required: false,
    },
  },

  setup(props, { emit }) {
    const data = reactive({
      showMenu: false,
    });

    const input = (event) => {
      emit("input", event);
    };

    const dateSelected = (date) => {
      emit("dateSelectionEvent", date);
    };

    return {
      data,
      input,
      dateSelected,
    };
  },
});
</script>
