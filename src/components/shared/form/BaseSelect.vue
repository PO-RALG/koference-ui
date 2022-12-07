<template>
  <div>
    <v-autocomplete
      v-if="required"
      :items="entries"
      :label="requiredLabel"
      :value="value"
      :item-value="itemValue"
      :item-text="itemText"
      :rules="data.rules.autocomplete"
      v-bind="{
        ...$attrs,
      }"
      @change="$emit('input', $event)"
      outlined
    >
    </v-autocomplete>
    <v-autocomplete
      v-else
      :items="entries"
      :label="label"
      :value="value"
      :item-value="itemValue"
      :item-text="itemText"
      v-bind="{
        ...$attrs,
      }"
      @change="$emit('input', $event)"
      outlined
    >
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import { reactive, computed, defineComponent } from "vue";
export default defineComponent({
  props: {
    label: {
      type: String,
      default: "Select",
    },
    value: {
      required: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    itemText: {
      required: false,
      default: "name",
      type: String,
    },
    itemValue: {
      required: false,
      default: "id",
    },
    items: {
      type: Array,
      required: true,
    },
  },

  setup(props) {
    const data = reactive({
      rules: {
        autocomplete: [(v) => !!v || "Item is required"],
      },
    });
    const entries = computed(() => {
      return props.items.map((item: any) => ({
        ...item,
        name: item.name ? item.name : item.description,
      }));
    });

    const requiredLabel = computed(() => {
      return `${props.label} *`;
    });

    return {
      data,
      entries,
      requiredLabel,
    };
  },
});
</script>
