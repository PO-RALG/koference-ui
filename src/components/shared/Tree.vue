<template>
  <li class="list-group-item group-item">
    <div :class="{ active: item.id === isActiveItem }" @click="selectGroup(item)">
      {{ item.name }}
      <span v-if="isFolder" @click="toggle"> [{{ data.isOpen ? "-" : "+" }}] </span>
    </div>
    <ul v-show="data.isOpen" v-if="isFolder" class="list-group">
      <tree
        class="item"
        v-for="(child, index) in item.children"
        :current-item="child.id"
        :key="index"
        :item="child"
        @select="select(child)"
      ></tree>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
export default defineComponent({
  props: {
    item: Object,
    currentItem: Number,
    selectedItem: Object,
  },

  setup(props, { emit }) {
    let data = reactive({
      isOpen: false,
    });

    const isFolder = computed(() => {
      return props.item.children && props.item.children.length;
    });

    const isActiveItem = computed(() => {
      return props.currentItem === props.item.id;
    });

    const toggle = () => {
      if (isFolder) {
        data.isOpen = !data.isOpen;
      }
    };

    const select = (node: any) => {
      emit("select", node);
    };

    const selectGroup = (node: any) => {
      select(node);
    };

    return {
      data,

      isFolder,
      isActiveItem,
      toggle,
      select,
      selectGroup,
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
