<template>
  <tr
    @click="handleRowClick"
    @mouseover="showTooltip"
    @mouseleave="hideTooltip"
  >
    <td>{{ item.createdAt | format() }}</td>
    <td>{{ item.queryCategory?.name }}</td>
    <td>{{ item.description }}</td>
    <td>{{ item.queryStatus?.name }}</td>
    <!-- Add other table columns as needed -->
    <v-tooltip :value="showingTooltip" top>
      <template v-slot:activator="{ on }">
        <div v-on="on">{{ item.tooltip }}</div>
      </template>
      <span class=""
        ><em>{{ " Click to see more details" }}</em></span
      >
    </v-tooltip>
  </tr>
</template>

<script>
export default {
  name: "ToolTip",
  props: {
    item: Object, // Data for the row
  },
  data() {
    return {
      showingTooltip: false,
    };
  },

  methods: {
    showTooltip() {
      this.showingTooltip = true;
    },
    hideTooltip() {
      this.showingTooltip = false;
    },
    handleRowClick() {
      this.$emit("row-clicked", this.item); // Emit the row data to the parent component
    },
  },
};
</script>
<style>
td {
  cursor: pointer;
}
</style>
