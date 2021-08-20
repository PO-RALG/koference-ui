<template>
  <v-snackbar :color="snackbar.color" v-model="snackbar.show" :bottom="true" :right="true">
    <v-icon white>{{ snackbar.icon }}</v-icon>
    {{ snackbar.message }}
    <v-btn text color="white" @click.native="snackbar.show = false"> CLOSE </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      snackbar: {
        show: false,
        message: "",
      },
    };
  },

  methods: {},

  created() {
    this.$store.watch(
      (state) => state.Helper.snackbar,
      () => {
        let snackbar = this.$store.getters.getSnackBar;
        if (snackbar.message !== "") {
          this.snackbar = snackbar;
        }
      }
    );
  },
};
</script>
