<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  setup() {
    console.log("Using Composition API");
  },
});
</script>

<style>
#App {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>>
