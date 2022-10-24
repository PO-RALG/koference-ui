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
        type="warning"
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
        return this.warningvalue;
      },
      set: function() {}
    }
  },
  props: ["warningvalue", "Message"],
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
