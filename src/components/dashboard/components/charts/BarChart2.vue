<template>
  <Bar
    :chart-options="data.chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Import the datalabels plugin
// import { datalabels } from "chartjs-plugin-datalabels";

// Register necessary modules
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "BarChart",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [], // Include the 'datalabels' plugin
    },
    chartData: {
      default: () => ({}),
    },
  },
  setup() {
    const data = reactive({
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Bar chart showing Number of query reported per Category ",
            fontSize: 16,
          },
          legend: {
            display: true,
            position: "right",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Category Name",
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of attended query",
            },
          },
        },
      },
    });
    return {
      data,
    };
  },
});
</script>
