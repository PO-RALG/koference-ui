<template>
  <v-col align="center" justify="center" class="pa-10">
    <div><img :src="data.img" class="logo" /></div>
    <div><strong>THE UNITED REPUBLIC OF TANZANIA</strong></div>
    <div><strong>President's Office, Regional Administration and Local Government(PO-RALG)</strong></div>
    <div>
      <strong>{{ location.name }} {{ facility.postal_address }}</strong>
    </div>
    <div class="facility-name">
      <strong>{{ facility.name }} {{ facilityType.name }}</strong>
    </div>
    <div class="source" v-if="title">
      <strong> {{ title }}</strong>
    </div>
    <div v-if="isDemo()" style="color: #ffc13e; font-size: 1.2em">(Specimen)</div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
export default defineComponent({
  props: {
    facility: {
      type: Object,
      required: true,
    },
    facilityType: {
      type: Object,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: null,
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
  border: 4px solid #ccc;
  @media print {
    display: block;
  }
}
</style>
