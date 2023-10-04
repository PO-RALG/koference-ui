<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { Line } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "LineChart",
  components: {
    Line,
  },
  setup() {
    const data = reactive({});

    const chartData = {
      labels: [
        "Babol",
        "Cabanatuan",
        "Daegu",
        "Jerusalem",
        "Fairfield",
        "New York",
        "Gangtok",
        "Buenos Aires",
        "Hafar Al-Batin",
        "Idlib",
      ],
      datasets: [
        {
          label: "Line Chart",
          data: [600, 1150, 342, 6050, 2522, 3241, 1259, 157, 1545, 9841],
          fill: false,
          borderColor: "#2554FF",
          backgroundColor: "#2554FF",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
      },
      legend: {
        display: true,
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    onMounted(() => {});

    return {
      data,
    };
  },
});
</script>
