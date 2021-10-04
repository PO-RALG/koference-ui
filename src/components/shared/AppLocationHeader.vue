<template>
  <div>
    <img :src="data.img" class="logo"/>
    <strong>THE UNITED REPUBLIC OF TANZANIA</strong>
    <span><strong>{{ facility.location.name }}</strong></span>
    <span class="facility-name"><strong>{{ facility.name }} - ({{ facility.location.name }})</strong></span>
    <span><strong> {{ (facility.postal_address) }}</strong></span>
    <span class="source"><strong>GENERAL LEDGER REPORT</strong></span>
    <span ng-if="demo" style="color:#FFC13E; font-size: 1.2em;">(Specimen)</span>
  </div>
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
  border: 4px solid #ccc;
}
</style>
