<template>
  <v-container>
      <v-row no-gutters>
        <v-col class="d-flex mt-10">
          <slot />
        </v-col>
      </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "EqualHeights",
  props: {
    columns: {
      type: String,
      default: 4,
    },
  },

  setup(props) {
    const maxColumns = computed(() => {
      const real = 12 / parseInt(props.columns);
      return real;
    });

    return {
      maxColumns,
    };
  },
});
</script>
