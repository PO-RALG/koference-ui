<template>
  <ul class="tree">
    <li :style="{ 'margin-left': `${depth * 5}px` }">
      <span v-if="hasChildren" @click="data.expanded = !data.expanded" class="type">
        <v-icon small>
          {{ data.expanded ? "mdi-chevron-down-box" : "mdi-chevron-right-box" }}
        </v-icon>
      </span>
      <span @click="nodeClicked($event, node)" class="name" :value="node">
        {{ node.name }}
      </span>
      <TreeBrowser
        v-show="data.expanded"
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :value="child"
        :depth="depth + 1"
        @onClick="(child) => $emit('onClick', child)"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { reactive, computed, PropType, defineComponent, ref } from "@vue/composition-api";

import { TreeNode } from "./types";

export default defineComponent({
  props: {
    node: {
      type: Object as PropType<TreeNode>,
      required: true,
      default: () => [],
    },
    multipleActive: {
      type: Boolean,
      required: false,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const activeElement = ref(null);
    const activeElements = ref(null);
    let data = reactive({
      expanded: false,
      active: "",
    });

    const setNodeClicked = (node: TreeNode) => {
      context.emit("onClick", node);
      context.emit("input", node);
    };

    const nodeClicked = (event: any, node: TreeNode) => {
      event.target.classList.toggle("active");
      setNodeClicked(node);
    };

    const hasChildren = computed(() => {
      return props.node && "children" in props.node ? true : false;
    });

    const level = computed(() => {
      return `${props.depth} + 1`;
    });

    return {
      data,

      nodeClicked,
      activeElement,
      activeElements,

      hasChildren,
      level,
    };
  },
});
</script>

<style scoped>
ul.tree,
ul.tree ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
ul.tree ul {
  margin-left: 8px;
}
ul.tree li {
  margin: 0;
  padding: 0 7px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: normal;
  border-left: 1px dotted rgb(100, 100, 100);
}
ul.tree li:last-child {
  border-left: none;
}
ul.tree li:before {
  position: relative;
  top: -0.3em;
  height: 1em;
  width: 12px;
  color: white;
  border-bottom: 1px dotted rgb(100, 100, 100);
  content: "";
  display: inline-block;
  left: 0;
}
ul.tree li:last-child:before {
  border-left: 1px dotted rgb(100, 100, 100);
}
.type {
  cursor: pointer;
}
.name {
  padding: 0;
  cursor: pointer;
}
.active {
  background: #c2e7ec;
}
</style>
