<template>
  <v-row justify="center">
    <v-dialog v-model="modal" persistent :max-width="width">
      <v-card>
        <slot name="header"></slot>
        <slot name="body"></slot>
        <slot name="footer"></slot>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    modal: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number,
      required: false,
      default: 600,
    },
  },
});
</script>
