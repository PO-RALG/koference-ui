<template>
  <v-card elevation="0">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-4">{{ title }}</div>
        <v-list-item-title class="text-h5 mb-1">
          {{ amount | toCurrency() }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  name: "MoneyCard",
});
</script>
