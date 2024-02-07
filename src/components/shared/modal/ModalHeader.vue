<template>
  <v-card-title
    :class="
      !showTitleBg && colour == 'red'
        ? 'red white--text pa-4'
        : ' bg_color white--text pa-4pa-4'
    "
  >
    <span class="text-h5">
      <v-icon large color="white">{{ icon }}</v-icon> {{ title }}</span
    >

    <v-spacer></v-spacer>
    <!-- <v-icon large color="white">mdi-close</v-icon> -->
    <v-btn
      v-if="is_signup && is_known === 'known'"
      @click="openSignUp"
      color="white"
      class="white--text d-md-none"
      text
    >
      Jisajili
    </v-btn>
    <v-btn
      v-if="is_signup && is_known === 'known'"
      @click="openSignUp"
      color="white"
      class="white--text d-none d-md-flex"
      text
    >
      Jisajili
    </v-btn>
    <span>
      <v-icon @click="closeDialogx" large color="white" style="cursor: pointer"
        >mdi-close</v-icon
      >
    </span>
  </v-card-title>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    colour: {
      type: String,
      required: false,
    },
    showTitleBg: {
      type: Boolean,
      default: false,
      required: false,
    },
    is_claiming: {
      type: Boolean,
      default: false,
      required: false,
    },
    is_signup: {
      type: Boolean,
      default: false,
      required: false,
    },
    is_known: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  methods: {
    closeDialogx() {
      console.log("data");
      this.$emit("closeDialog");
    },
    openSignUp() {
      console.log("data");
      this.$emit("openSignUp");
    },
  },
});
</script>
<style>
.bg_color {
  background: #052f69 !important;
}
.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
</style>
