<template>
  <div>
    <v-card elevation="1" class="mt-10 pt-5 pl-5 pr-5 mb-0 top-card">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="6"
            :style="$vuetify.breakpoint.lgAndUp ? ' flex: 1 0 20%;' : ''"
            sm="12"
            class="border-right"
          >
            <MoneyCard
              :title="'Total Queries'"
              :amount="data.summary.total_query_count"
              :title_summary="'List of all submited queries'"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            :style="$vuetify.breakpoint.lgAndUp ? ' flex: 1 0 20%;' : ''"
            sm="12"
            class="border-right"
          >
            <MoneyCard
              :title="'Pending Queries'"
              :amount="data.summary.pending_query_count"
              :title_summary="'List of all queries that has been not assigned to attendant'"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            :style="$vuetify.breakpoint.lgAndUp ? ' flex: 1 0 20%;' : ''"
            sm="12"
            class="border-right"
          >
            <MoneyCard
              :title="'Replied Queries'"
              :amount="data.summary.replied_queries"
              :title_summary="'List of all queries that has been attended'"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            :style="$vuetify.breakpoint.lgAndUp ? ' flex: 1 0 20%;' : ''"
            sm="12"
            class="border-right"
          >
            <MoneyCard
              :title="'Under processing Queries'"
              :amount="data.summary.underprocessing_queries"
              :title_summary="'List of all queries that has been assigned to attendant but not replied'"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card
      elevation="0"
      class="top-card mt-5"
      style="border-bottom: 1px solid #ccc"
    >
      <v-container>
        <v-row>
          <v-col cols="12" md="3" sm="12" class="border-right">
            <BarChart2
              :chartData="data.currentSource"
              :height="500"
              :width="400"
            />
          </v-col>
          <v-col cols="12" md="2" sm="12" class="border-right">
            <PieChart
              :chartData="data.reporterBySource"
              :height="500"
              :width="400"
            />
          </v-col>
          <v-col cols="12" md="3" sm="12" class="border-right">
            <BarChart
              :chartData="data.reporterTopFiveRepoeter"
              :height="500"
              :width="400"
            />
          </v-col>
          <v-col cols="12" md="3" sm="12" class="border-right">
            <PieChart
              :chartData="data.reporterByGender"
              :height="500"
              :width="400"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "vue";

import {
  getByCategory,
  getByNature,
  queryTopFive,
  queryByGender,
  querySummary,
} from "@/components/dashboard/services";
import BarChart from "@/components/dashboard/components/charts/BarChart.vue";
import BarChart2 from "@/components/dashboard/components/charts/BarChart2.vue";
import PieChart from "@/components/dashboard/components/charts/PieChart.vue";

interface Level {
  id: number;
  code: string;
  name: string;
  position: number;
}

interface ChartOptions {
  label: string;
  backgroundColor: Array<string>;
  borderColor: Array<string>;
  pointBorderColor: string;
  borderWidth: number;
  data: Array<string>;
}

interface ChartData {
  labels: Array<string>;
  datasets: Array<ChartOptions>;
}

export default defineComponent({
  components: {
    BarChart,
    BarChart2,
    PieChart,
  },

  setup() {
    let currentSource: ChartData;
    let reporterByGender: ChartData;
    let loadDashboardsByGender: ChartData;
    let reporterTopFiveRepoeter: ChartData;
    let reporterBySource: ChartData;
    const graphs = [1, 2, 3];

    const data = reactive({
      valid: false,
      graphs,
      loadDashboardsByGender,
      reporterTopFiveRepoeter,
      reporterBySource,
      currentSource,
      reporterByGender,
      summary: {
        total_query_count: "",
        pending_query_count: "",
        replied_queries: "",
        underprocessing_queries: "",
      },
    });

    onMounted(() => {
      loadDashboards();
    });

    const mapCurrentQueries = (results: Array<CurrentSource>): ChartData => {
      const labels = results.map((result) => result.category);
      const data = results.map((result) => result.record_count);

      const dataOptions: ChartData = {
        labels,
        datasets: [
          {
            label: "Reported queries",
            borderWidth: 1,
            backgroundColor: ["#AED581", "#81C784", "#CFD8DC"],
            borderColor: ["#00D8FF"],
            pointBorderColor: "",
            data: [...data],
          },
        ],
      };
      return dataOptions;
    };

    const mapCurrentNature = (results: Array<CurrentSource>): ChartData => {
      const labels = results.map((result) => result.category);
      const data = results.map((result) => result.record_count);

      const dataOptions: ChartData = {
        labels,
        datasets: [
          {
            label: "Number query from user nature",
            borderWidth: 1,
            backgroundColor: ["#B3E5FC", "#B2DFDB", "#DD1B16"],
            borderColor: ["#00D8FF"],
            pointBorderColor: "",
            data: [...data],
          },
        ],
      };
      return dataOptions;
    };

    const mapTopFive = (results: Array<CurrentSource>): ChartData => {
      const labels = results.map((result) => result.category);
      const data = results.map((result) => result.record_count);

      const dataOptions: any = {
        labels,
        datasets: [
          {
            label: "Query reported",
            borderWidth: 1,
            backgroundColor: ["#4DB6AC"],
            borderColor: ["#00D8FF"],
            pointBorderColor: "",
            data: [...data],
          },
        ],
      };
      return dataOptions;
    };

    const mapTopQueryByGender = (results: Array<CurrentSource>): ChartData => {
      const labels = results.map((result) => result.category);
      const data = results.map((result) => result.record_count);

      const dataOptions: ChartData = {
        labels,
        datasets: [
          {
            label: "Number query from user nature",
            borderWidth: 1,
            backgroundColor: ["#EEEEEE", "#BDBDBD"],
            borderColor: ["#00D8FF"],
            pointBorderColor: "",
            data: [...data],
          },
        ],
      };
      return dataOptions;
    };

    const loadDashboards = async () => {
      const summaries = await querySummary({});
      data.summary = summaries.data[0];

      const currResp = await getByCategory({});
      const _mappedCurrentSource = mapCurrentQueries(currResp.data);
      data.currentSource = _mappedCurrentSource;

      const currNature = await getByNature({});
      const _mappedNature = mapCurrentNature(currNature.data);
      data.reporterBySource = _mappedNature;

      const currTopFive = await queryTopFive({});
      const _mappedTopFive = mapTopFive(currTopFive.data);
      data.reporterTopFiveRepoeter = _mappedTopFive;

      const currQueryByGender = await queryByGender({});
      const _mappedQueryByGender = mapTopQueryByGender(currQueryByGender.data);
      data.reporterByGender = _mappedQueryByGender;
    };

    return {
      data,
    };
  },
});
</script>

<style lang="scss" scoped>
.top-card {
  border-top: 1px solid #ccc;
  border-radius: 0;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
.border-right {
  border-right: 1px solid #ccc;
  &:last-child {
    border: none;
  }
}
</style>
