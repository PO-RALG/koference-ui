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
      default: 500,
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
      type: Object,
      default: () => {},
    },
    chartData: {
      default: () => ({}),
    },
  },
  setup() {
    const data = reactive({
      backgroundColor: "#f87979",
      chartOptions: {
        plugins: {
          title: {
            display: true,
            text: "Bar chart showing Top 5 claimers", // Add your title here
            fontSize: 16, // Customize the font size if needed
          },
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Claimer Name", // Add your X-axis label here
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of submited query", // Add your Y-axis label here
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
