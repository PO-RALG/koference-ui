<template>
  <v-snackbar v-model="data.snackbar.show" :bottom="true" :right="true">
    <v-icon white>{{ data.snackbar.icon }}</v-icon>
    {{ data.snackbar.message }}
    <v-btn text color="white" @click.native="data.snackbar.show = false">
      CLOSE
    </v-btn>
  </v-snackbar>
</template>

<script>
import store from "@/store";

import { defineComponent, watch, reactive } from "@vue/composition-api";
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
        // let snackbar = this.$store.getters.getSnackBar;
        if (store.getters.getSnackBar.message !== "") {
          data.snackbar = store.getters.getSnackBar;
          console.log("datazzzzz 22222", store.getters.getSnackBar);
        }
      }
    );
    return {
      data,
    };
  },
});
</script>
