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
    <td v-if="item.senderfn && item.senderln">{{ item.senderfn }}{{ " " }}{{ item.senderln }}</td>
    <td v-else>{{ "Anonymous"}}</td>


    <td>{{ item.days_passed }}</td>
    <td>
      <div
        v-if="item.days_passed > 2 && item.status != 'Imejibiwa'"
        class="warning-dot"
      >
        
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

.warning-dot {
  width: 10px; /* Adjust the width of the dot as needed */
  height: 10px; /* Adjust the height of the dot as needed */
  background-color: #ff0000; /* Red color for the dot */
  border-radius: 50%; /* Makes the dot circular */
  display: inline-block; /* Display as an inline block */
  animation: blink 1s infinite; /* Blinking animation */
}

@keyframes blink {
  0%, 100% {
    opacity: 0; /* Dot is invisible at the start and end of the animation */
  }
  50% {
    opacity: 1; /* Dot is visible in the middle of the animation */
  }
}

</style>
