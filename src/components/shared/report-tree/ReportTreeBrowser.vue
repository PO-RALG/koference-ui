<template>
  <ul class="tree" v-if="node">
    <li :style="{ 'margin-left': `${depth * 5}px` }">
      <span v-if="hasChildren" @click="nodeClicked()" class="type">
        <v-icon small>
          {{ data.expanded ? "mdi-chevron-down-box" : "mdi-chevron-right-box" }}
        </v-icon>
        {{ node.name }}
      </span>
      <span
        v-else
        @click="nodeClicked()"
        :class="{ active: isActiveItem }"
        class="name"
        :value="node"
      >
        <v-icon>mdi-file-document</v-icon>
        {{ node.name }}
      </span>

      <ReportTreeBrowser
        v-show="data.expanded"
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :value="child"
        :depth="depth + 1"
        :current-item="currentItem"
        @onClick="(child) => $emit('onClick', child)"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useReportTree } from "./composables/use-report-tree";

import { TreeNode } from "./types";

export default defineComponent({
  props: {
    node: {
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
    captionField: {
      type: String,
      required: false,
      default: "name",
    },
    childrenField: {
      type: String,
      required: false,
      default: "children",
    },
    attachmentIcon: {
      type: String,
      required: false,
      default: "",
    },
    currentItem: {
      type: Object as PropType<TreeNode>,
    },
  },

  setup(props, context) {
    const {
      data,
      nodeClicked,
      hasChildren,
      isActiveItem,
      level,
      hasAttachment,
    } = useReportTree(props, context);
    return {
      data,
      nodeClicked,
      hasChildren,
      isActiveItem,
      level,
      hasAttachment,
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
