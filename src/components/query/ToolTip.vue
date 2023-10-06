<template>
  <tr
    @click="handleRowClick"
    @mouseover="showTooltip"
    @mouseleave="hideTooltip"
  >
    <!-- <td>{{ new Date() - new Date(item.createdAt) }}</td> -->
    <td>{{ item.created | format() }}</td>
    <td v-if="item.category">{{ item.category }}</td>
    <td v-if="!item.category">{{ "Not categorized" }}</td>
    <!-- <td>{{ item.description }}</td> -->
    <td>{{ item.status }}</td>
    <td>{{ item.days_passed }}</td>
    <td>
      <div
        v-if="item.days_passed > 14 && item.status != 'Imejibiwa'"
        class="warningx"
      >
        This query is out of normal time to be executed!
      </div>
    </td>
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
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.warningx {
  animation: blink 1s infinite; /* Adjust the animation duration as needed */
  background-color: #ff0000; /* Background color for the warning */
  color: #fff; /* Text color for the warning */
  padding: 10px; /* Adjust padding as needed */
}
</style>
