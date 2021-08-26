<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="12" md="12" sm="12">
        <v-text-field :label="label" type="text" v-model="data.search" required @keydown="clearSearch"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="5" md="4" sm="12">
        <select class="dual-multselect" multiple>
          <option
            v-for="item in items"
            @click="highlightItem(item)"
            @dblclick="addItem(item)"
            :value="item"
            :key="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </v-col>
      <v-col cols="12" lg="2" md="2" sm="12">
        <div class="button-container">
          <v-btn color="primary" :disabled="items.length === 0" small @click="addItems">
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>
          <v-btn color="primary" small class="remove-button" :disabled="items.length === 0" @click="addAll">
            <v-icon>mdi-chevron-double-right</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            small
            :disabled="data.selectedItems && data.selectedItems.length === 0"
            class="remove-button"
            @click="removeItems"
          >
            <v-icon>mdi-menu-left</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            small
            class="remove-button"
            :disabled="data.selectedItems && data.selectedItems.length === 0"
            @click="removeAll"
          >
            <v-icon>mdi-chevron-double-left</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" lg="5" md="4" sm="12">
        <select class="dual-multselect" multiple>
          <option
            v-for="item in data.selectedItems"
            @click="highlightItem(item)"
            @dblclick="removeItem(item)"
            :value="item"
            :key="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </v-col>
      <v-col></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  reactive,
  onMounted,
  computed,
  watch,
  onUnmounted,
  PropType,
  defineComponent,
} from "@vue/composition-api";

import { Selectable } from "./types";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: false,
    },
    items: {
      type: Array as PropType<Array<Selectable>>,
      required: true,
    },

    label: {
      type: String,
      required: false,
    },

    filterFunction: {
      type: Function,
      required: false,
    },
  },

  setup(props, context) {
    let data = reactive({
      search: "",
      itemsToSelect: [] as any,
      selectedItems: [] as any,
    });

    const refreshList = () => {
      data.selectedItems.forEach((item: Selectable) => {
        const idx = props.items.map((i) => i.id).indexOf(item.id);
        if (idx !== -1) {
          props.items.splice(idx, 1);
        }
      });
    };

    const search = () => {
      context.emit("filterFunction", data.search);
    };

    const highlightItem = (item: any) => {
      data.itemsToSelect.push(item);
    };

    const selectAll = () => {
      props.items.forEach((item) => {
        data.selectedItems.push(item);
      });

      props.items = [];
      data.itemsToSelect = [];
      context.emit("input", data.selectedItems);
      refreshList();
    };

    const addItem = (item: any) => {
      const el: any = props.items.find((el: any) => el.id === item.id);
      const idx = props.items.indexOf(el);

      if (idx !== -1) {
        props.items.splice(idx, 1);
        data.selectedItems.push(el);
        data.itemsToSelect = [];
      }
      context.emit("input", data.selectedItems);
      refreshList();
    };

    const removeItem = (item: any) => {
      const el: any = data.selectedItems.find((el: any) => el.id === item.id);
      const idx = data.selectedItems.indexOf(el);

      if (idx !== -1) {
        data.selectedItems.splice(idx, 1);
        props.items.push(el);
        data.itemsToSelect = [];
      }

      context.emit("input", data.selectedItems);
      refreshList();
    };

    const addItems = () => {
      data.itemsToSelect.forEach((item: Selectable) => {
        const idx = props.items.map((i) => i.id).indexOf(item.id);
        if (idx !== -1) {
          props.items.splice(idx, 1);
          data.selectedItems.push(item);
          data.itemsToSelect = [];
        }
      });

      context.emit("input", data.selectedItems);
      refreshList();
    };

    const removeItems = () => {
      data.itemsToSelect.forEach((item: any) => {
        const idx = data.selectedItems.map((i: any) => i.id).indexOf(item.id);
        if (idx !== -1) {
          data.selectedItems.splice(idx, 1);
          props.items.push(item);
          data.itemsToSelect = [];
        }
      });

      context.emit("input", data.selectedItems);
      refreshList();
    };

    const removeAll = () => {
      data.selectedItems.forEach((item: any) => {
        props.items.push(item);
      });
      data.selectedItems = [];

      context.emit("input", data.selectedItems);
      refreshList();
    };

    const addAll = () => {
      props.items.forEach((item) => {
        data.selectedItems.push(item);
      });

      context.emit("input", data.selectedItems);
      refreshList();
    };

    // lifecycle hooks
    onMounted(() => {
      refreshList();
    });

    onUnmounted(() => {
      refreshList();
      data.selectedItems = [];
    });

    // computed
    const filteredData = computed(() => {
      return props.items.map((item) => {
        //item["itemName"] = item[props.columnName];
      });
    });

    const clearSearch = (e) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        data.search = e.target.value;
        context.emit("filterFunction", data.search);
      }
    };

    // watchers
    watch(data, (newValue: any) => {
      context.emit("filterFunction", newValue.search);
    });

    return {
      data,

      // methods
      highlightItem,
      selectAll,
      refreshList,
      addItem,
      removeItem,
      addItems,
      removeItems,
      removeAll,
      addAll,
      search,
      clearSearch,

      // computed
      filteredData,

      //lifecycle hooks
      onMounted,
      onUnmounted,
    };
  },
});
</script>

<style scoped lang="scss">
select {
  display: block;
  overflow: hidden;
  overflow-y: scroll;
  font-size: 14px;
  font-weight: 400;
  min-height: 140px;
  line-height: 1.125;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
  background-clip: padding-box;
  padding: 0.4375rem 0.4375rem;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  width: 100%;
  &:active {
    border: 2px solid #1a4677;
  }
}

.button-container {
  position: relative;
  top: 5px;
}

.v-text-field {
  padding-top: 5px !important;
}

.container {
  padding: 0 !important;
}

div[class^="col-"] {
  padding: 0px 8px !important;
}

button {
  margin-top: 5px;
}
</style>
