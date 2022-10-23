<template>
  <div class="login-application-container">
    <SnackBar />
    <Loader />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SnackBar from "@/components/shared/SnackBar.vue";

export default defineComponent({
  components: {
    SnackBar,
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
.v-main__wrap {
  margin-left: 5px;
}
</style>
