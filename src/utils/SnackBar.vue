<template>
  <v-snackbar
    :color="data.snackbar.color"
    v-model="data.snackbar.show"
    :bottom="true"
    :right="true"
  >
    <v-icon white>{{ data.snackbar.icon }}</v-icon>
    {{ data.snackbar.message }}
    <v-btn text color="white" @click.native="data.snackbar.show = false">
      CLOSE
    </v-btn>
  </v-snackbar>
</template>

<script>
import store from "@/store";

import { defineComponent, watch, reactive } from "vue";
export default defineComponent({
  setup() {
    let data = reactive({
      snackbar: {
        show: false,
        message: "",
        icon: "",
      },
    });
    watch(
      () => store.state.snackbar,
      () => {
        if (store.getters.getSnackBar.message !== "") {
          data.snackbar = store.getters.getSnackBar;
        }
      }
    );
    return {
      data,
    };
  },
});
</script>
