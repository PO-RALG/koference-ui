<template>
  <div class="text-center">
    <v-dialog v-model="isInfoDialogOpen" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2"> INFO </v-card-title>

        <v-card-text>
          {{ infoMessage }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeInfoDialog"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "InfoDialog",
  props: {
    isInfoDialogOpen: {
      type: Boolean,
      required: true,
    },
    infoMessage: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const closeInfoDialog = () => {
      props.onClose(props.isInfoDialogOpen);
    };

    return {
      closeInfoDialog,
    };
  },
});
</script>
