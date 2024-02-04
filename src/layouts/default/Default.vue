<template>
  <v-app>
    <default-bar />

    <!-- Add margin and spacing to create space between components -->
    <!-- <v-container class="mt-1"> -->
    <Slider class="mb-1" />
    <Video class="mag mt-12" />
    <Theme class="mb-1 pt-12" />
    <!-- <Events class="mb-1 pt-12" /> -->

    <Sponser class="mb-1 mt-12" />

    <Footer class="mb-1 pt-12" />
    <!-- </v-container> -->
  </v-app>
</template>

<script setup>
import DefaultBar from "./AppBar.vue";
import Slider from "../../components/Slider.vue";
import Sponser from "../../components/Sponser.vue";
import Footer from "../../components/Footer.vue";
import Events from "../../components/Events.vue";
import Video from "../../components/Video.vue";
import Theme from "../../components/Theme.vue";
</script>
<style>
.mag {
  margin-bottom: 40px;
}
</style>
