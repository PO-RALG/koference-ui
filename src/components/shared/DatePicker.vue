<template>
  <v-layout row wrap>
    <v-menu
      v-model="showMenu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field :label="label" prepend-icon="mdi-calendar-range" readonly :value="value" v-on="on"></v-text-field>
      </template>
      <v-date-picker locale="en-in" :value="value" no-title @input="input($event)"></v-date-picker>
    </v-menu>
  </v-layout>
</template>

<script>
export default {
  props: ["value", "label"],

  data() {
    return {
      showMenu: false,
    };
  },

  methods: {
    input(event) {
      this.showMenu = false;
      this.$emit("input", event);
    },
  },
};
</script>
