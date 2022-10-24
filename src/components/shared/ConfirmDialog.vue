<template>
  <v-row justify="center">
    <v-dialog v-model="isOpen" persistent max-width="350">
      <v-card>
        <v-card-title class="headline primary white--text">{{ title }}</v-card-title>
        <v-card-text class="pa-4">{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="reject">NO</v-btn>
          <v-btn color="green darken-1" text @click="accept" :loading="loading">YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    isOpen: { type: Boolean, required: true },
    message: { type: String, default: "Are you sure?" },
    title: { type: String, default: "Delete Item" },
    rejectFunction: { type: Function },
    acceptFunction: { type: Function },
    loading: { type: Boolean },
    data: { type: Object },
  },

  setup(props, { emit }) {
    const reject = () => {
      emit("rejectFunction");
    };

    const accept = () => {
      const data = props.data ? props.data : null;
      if (data) {
        emit("acceptFunction", data.id);
      } else {
        emit("acceptFunction");
      }
    };

    return {
      reject,
      accept,
    };
  },
});
</script>
