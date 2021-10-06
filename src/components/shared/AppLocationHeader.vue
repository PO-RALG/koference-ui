<template>
  <v-col align="center" justify="center" class="pa-10">
    <div><img :src="data.img" class="logo" /></div>
    <div><strong>THE UNITED REPUBLIC OF TANZANIA</strong></div>
    <div class="facility-name"><strong>{{ facility.name }} {{ facility.facility_type.name }}</strong></div>
    <div><strong>{{ facility.location.name }} {{ facility.postal_address }}</strong></div>
    <div class="source"><strong>GENERAL LEDGER REPORT</strong></div>
    <div v-if="isDemo()" style="color: #ffc13e; font-size: 1.2em">(Specimen)</div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
export default defineComponent({
  props: {
    facility: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const data = reactive({
      img: "/coat_of_arms.svg.png",
    });
    return { data };
  },
});
</script>

<style lang="scss">
.logo {
  width: 90px;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  display: none;
  border: 4px solid #ccc;
  @media print {
    display: block;
  }
}
</style>
