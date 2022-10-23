<template>
  <v-container class="preloader" v-if="loading">
    <v-row align="center" justify="center">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useState } from "vuex-composition-helpers";
import store from "@/store";

export default defineComponent({
  setup() {
    const { loading } = useState(store, "Loader", ["loading"]);
    return {
      loading,
    };
  },
});
</script>

<style scoped>
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid rgb(33 150 243);
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
.preloader {
  z-index: 20000;
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: transparent;
}
</style>
