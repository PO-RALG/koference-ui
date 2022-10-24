<template>
  <v-card height="100%">
    <h4 class="pl-4 column-header">{{ item.resource }}</h4>
    <v-data-table
      :headers="data.headers"
      :items="item[columnName]"
      hide-default-header
      hide-default-footer
      disable-pagination
      v-model="data.selectedItems"
      @item-selected="selectItem"
      @click:row="rowClick"
      show-select
    >
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: false,
    },
    itemSelected: {
      type: Function,
    },
    selected: {
      type: Array,
    },
    columnName: {
      type: String,
      default: "entries",
    },
  },

  setup(props, { emit }) {
    let data = reactive({
      headers: [{ text: "Name", value: "name", align: "start" }],
      selectedItems: props.selected,
    });

    const selectItem = ({ item }) => {
      emit("itemSelected", item);
    };

    const rowClick = (item, row) => {
      let selectState = row.isSelected ? false : true;
      row.select(selectState);
    };

    return {
      data,
      selectItem,
      rowClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.column-header {
  background: #e9e6e6;
}
.v-card {
  max-width: 94%;
  margin-left: 10px;
  margin-top: 10px;
}
.text-start {
  width: 0;
  padding: 4px 0;
}
</style>
