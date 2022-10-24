<template>
  <div class="text-center">
    <v-flex xs12 md12>
      <v-alert
        @input="Reset"
        v-model="activationValue"
        outlined
        dense
        dismissible
        margin-right
        type="success"
        prominent
        border="top"
      >{{Message}}</v-alert>
    </v-flex>
  </div>
</template>


<script>
export default {
  computed: {
    activationValue: {
      get: function() {
        return this.successvalue;
      },
      set: function() {}
    }
  },
  props: ["successvalue", "Message"],
  data() {
    return {};
  },
  methods: {
    Reset() {
      this.$emit("Setfalse");
    }
  }
};
</script>
