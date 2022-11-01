<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="5" md="4" sm="12" class="mt-2 mb-n4">
        <v-text-field
          :label="`filter ${modelName} by ${label}...`"
          type="text"
          v-model="data.searchSource"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" lg="2" md="2" sm="12" class="pl-6"> </v-col>
      <v-col cols="12" lg="5" md="4" sm="12" class="mt-2 mb-n4">
        <v-text-field
          :label="`filter ${modelName} by ${label}...`"
          type="text"
          v-model="data.searchDestination"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="5" md="4" sm="12">
        <select class="dual-multselect" multiple>
          <option
            v-for="(item, key) in source
              .map((item, idx) => ({ idx, ...item }))
              .filter((item) =>
                item[label in item ? label : 'label']
                  .toLowerCase()
                  .includes(data.searchSource.toLowerCase())
              )"
            :key="key"
            @click="highlightSourceItem(item)"
            @dblclick="addItem(item)"
            :value="item"
          >
            {{ item[label in item ? label : "label"] }}
          </option>
        </select>
      </v-col>
      <v-col cols="12" lg="2" md="2" sm="12" class="pl-6 mt-n2">
        <div class="button-container">
          <!-- add items -->
          <v-btn
            color="primary"
            :disabled="
              data.itemsToDestination && data.itemsToDestination.length < 1
            "
            small
            @click="addItems"
          >
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>

          <!-- add all items -->
          <v-btn
            color="primary"
            :disabled="source.length < 1"
            small
            class="remove-button"
            @click="addAll"
          >
            <v-icon>mdi-chevron-double-right</v-icon>
          </v-btn>

          <!-- remove items -->
          <v-btn
            color="primary"
            small
            :disabled="data.itemsToSource && data.itemsToSource.length < 1"
            class="remove-button"
            @click="removeItems"
          >
            <v-icon>mdi-menu-left</v-icon>
          </v-btn>

          <!-- remove all items -->
          <v-btn color="primary" small class="remove-button" @click="removeAll">
            <v-icon>mdi-chevron-double-left</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" lg="5" md="4" sm="12">
        <select class="dual-multselect" multiple>
          <option
            v-for="(item, key) in destination
              .map((item, idx) => ({ idx, ...item }))
              .filter((item) =>
                item[label in item ? label : 'label']
                  .toLowerCase()
                  .includes(data.searchDestination.toLowerCase())
              )"
            :key="key"
            @click="highlightDestinationItem(item)"
            @dblclick="removeItem(item)"
            :value="item"
          >
            {{ item[label in item ? label : "label"] }}
          </option>
        </select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  reactive,
  PropType,
  onMounted,
  defineComponent,
} from "vue";

import _ from "lodash";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: false,
    },

    source: {
      type: Array as PropType<Array<any>>,
      required: true,
    },

    destination: {
      type: Array as PropType<Array<any>>,
      required: true,
    },

    label: {
      type: String,
      required: false,
    },
    modelName: {
      type: String,
      required: false,
      default: "roles",
    },
  },

  setup(props, context) {
    const data = reactive({
      searchSource: "",
      searchDestination: "",
      itemsToDestination: [],
      itemsToSource: [],
    });

    const highlightSourceItem = (item) => {
      data.itemsToDestination.push(item);
    };

    const highlightDestinationItem = (item) => {
      data.itemsToSource.push(item);
    };

    const addItem = (item) => {
      const idx = props.source.map((i) => i.id).indexOf(item.id);
      if (idx !== -1) {
        props.source.splice(idx, 1);
        props.destination.push(item);
        data.itemsToDestination = [];
      }

      let source = [...props.source];
      let destination = [...props.destination];
      data.searchSource = "";
      data.searchDestination = "";
      context.emit("onChangeList", { source, destination });
    };

    const addItems = () => {
      data.itemsToDestination.forEach((item) => {
        const idx = props.source.map((i) => i.id).indexOf(item.id);
        if (idx !== -1) {
          props.source.splice(idx, 1);
          props.destination.push(item);
          data.itemsToDestination = [];
        }
      });

      let source = [...props.source];
      let destination = [...props.destination];
      data.searchSource = "";
      data.searchDestination = "";
      context.emit("onChangeList", { source, destination });
    };

    const removeItems = () => {
      data.itemsToSource.forEach((item) => {
        const idx = props.destination.map((i) => i.id).indexOf(item.id);
        if (idx !== -1) {
          props.destination.splice(idx, 1);
          props.source.push(item);
          data.itemsToSource = [];
        }
      });

      let source = [...props.source];
      let destination = [...props.destination];
      data.searchSource = "";
      data.searchDestination = "";
      context.emit("onChangeList", { source, destination });
    };

    const removeItem = (item) => {
      const idx = props.destination.map((i) => i.id).indexOf(item.id);
      if (idx !== -1) {
        props.destination.splice(idx, 1);
        props.source.push(item);
        data.itemsToSource = [];
      }

      let source = [...props.source];
      let destination = [...props.destination];
      data.searchSource = "";
      data.searchDestination = "";
      context.emit("onChangeList", { source, destination });
    };

    const addAll = () => {
      props.source.forEach((item) => {
        props.destination.push(item);
      });

      props.source.splice(0, props.source.length);

      let source = [...props.source];
      let destination = [...props.destination];

      data.searchSource = "";
      data.searchDestination = "";
      context.emit("onChangeList", { source, destination });
    };

    const removeAll = () => {
      props.destination.forEach((item) => {
        props.source.push(item);
      });

      props.destination.splice(0, props.destination.length);

      let source = [...props.source];
      let destination = [...props.destination];

      data.searchSource = "";
      data.searchDestination = "";
      context.emit("onChangeList", { source, destination });
    };

    const selectDestination = (index: number) => {
      let source = props.source;
      let destination = props.destination.map((idx, k) => {
        if (k === index) {
          idx.selected = !idx.selected;
        }
        return idx;
      });
      context.emit("onChangeList", {
        source,
        destination,
      });
    };

    const selectSource = (index: number) => {
      let destination = props.destination;
      let source = props.source.map((idx, k) => {
        if (k === index) {
          idx.selected = !idx.selected;
        }
        return idx;
      });
      context.emit("onChangeList", { source, destination });
    };

    const selectAllSource = () => {
      let source = props.source.map((item) => ({ ...item, selected: true }));
      let destination = props.destination;

      context.emit("onChangeList", { source, destination });
    };

    const deselectAllSource = () => {
      let source = props.source.map((item) => ({ ...item, selected: false }));
      let destination = props.destination;
      context.emit("onChangeList", { source, destination });
    };

    const selectAllDestination = () => {
      let destination = props.destination.map((item) => ({
        ...item,
        selected: true,
      }));
      let source = props.source;

      context.emit("onChangeList", { source, destination });
    };

    const deselectAllDestination = () => {
      let destination = props.destination.map((item) => ({
        ...item,
        selected: false,
      }));

      let source = props.source;
      context.emit("onChangeList", { source, destination });
    };

    const sanitizeSource = () => {
      if (props.destination.length > 0) {
        props.destination.forEach((item) => {
          const idx = props.source.map((i) => i.id).indexOf(item.id);
          if (idx !== -1) {
            props.source.splice(idx, 1);
          }
        });
      }
    };

    onMounted(() => {
      sanitizeSource();
    });

    return {
      data,

      // methods
      removeItem,
      addItems,
      removeItems,
      addItem,
      removeAll,
      addAll,
      selectSource,
      selectDestination,
      selectAllDestination,
      selectAllSource,
      deselectAllDestination,
      deselectAllSource,

      highlightSourceItem,
      highlightDestinationItem,

      // computed

      //lifecycle hooks
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
  top: -5px;
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
