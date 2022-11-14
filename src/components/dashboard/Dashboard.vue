<template>
  <div>
    <v-card elevation="1" class="mt-10 pt-5 pl-5 pr-5 mb-0 top-card">
      <v-form ref="form" v-model="data.valid">
        <v-container>
          <v-row>
            <v-col
              cols="12"
              :md="showSmallColumns ? 4 : 3"
              v-if="!isLowLevelUser()"
            >
              <v-select
                :items="data.entries"
                label="Select Region"
                outlined
                v-model="data.formData.region_id"
                @change="filterDashboard(true)"
                :disabled="data.isCouncil"
                :item-text="'displayName'"
                item-value="id"
              >
                <template v-slot:prepend-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field
                        outlined
                        dense
                        placeholder="Search Admin Areas..."
                        @input="searchAdminAreas"
                        height="60"
                        hide-details=""
                        @click:clear="resetSearchText()"
                        clearable
                      ></v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col
              cols="12"
              md="3"
              :md="showSmallColumns ? 4 : 3"
              v-if="!isLowLevelUser() && !data.isCouncil"
            >
              <v-select
                :items="data.councils"
                label="Select Council"
                outlined
                v-model="data.formData.council_id"
                @change="filterDashboard(false)"
                :item-text="'displayName'"
                item-value="id"
              >
              </v-select>
            </v-col>
            <v-col
              v-if="!isLowLevelUser()"
              cols="12"
              :md="showSmallColumns ? 4 : 3"
            >
              <fetcher :api="'/api/v1/financial-years'">
                <div slot-scope="{ json: entries, loading }">
                  <div v-if="loading">Loading...</div>
                  <v-select
                    v-else
                    :items="entries"
                    :item-text="'name'"
                    label="Financial Year"
                    @change="filterDashboard"
                    item-value="id"
                    outlined
                    v-model="data.formData.financial_year_id"
                  />
                </div>
              </fetcher>
            </v-col>
            <v-col v-else cols="12" :md="12">
              <fetcher :api="'/api/v1/financial-years'">
                <div slot-scope="{ json: entries, loading }">
                  <div v-if="loading">Loading...</div>
                  <v-select
                    v-else
                    :items="entries"
                    :item-text="'name'"
                    label="Financial Year"
                    @change="filterDashboard"
                    item-value="id"
                    outlined
                    v-model="data.formData.financial_year_id"
                  />
                </div>
              </fetcher>
            </v-col>
            <v-col
              cols="12"
              :md="showSmallColumns ? 4 : 3"
              v-if="!isLowLevelUser()"
            >
              <v-select
                :items="data.facilities"
                label="Select Facility"
                outlined
                v-model="data.formData.fac_id"
                :item-text="'displayName'"
                @change="filterDashboard"
                item-value="id"
              >
                <template v-slot:prepend-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field
                        outlined
                        dense
                        placeholder="Search Facilities..."
                        @input="searchFacilities"
                        height="60"
                        hide-details=""
                      ></v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <v-card elevation="1" class="top-card">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="6"
            :style="$vuetify.breakpoint.lgAndUp ? ' flex: 1 0 20%;' : ''"
            sm="12"
            class="border-right"
            v-for="entry in data.cardData"
            :key="entry.id"
          >
            <MoneyCard :title="entry.title" :amount="entry.amount" />
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
          <v-col cols="12" md="6" sm="12" class="border-right">
            <BarChart
              :chartData="data.currentSource"
              :height="500"
              :width="400"
            />
          </v-col>
          <v-col cols="12" md="6" sm="12" class="border-right">
            <BarChart
              :chartData="data.receivedVsPayments"
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
import EqualHeights from "@/components/shared/equal-heights/EqualHeights.vue";
import MoneyCard from "@/components/dashboard/components/MoneyCard.vue";
import { getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";
import { get as getFacilities } from "@/components/facility/facility/services/facility.service";
import {
  byMonth,
  get,
  getByCurrentSource,
  getCarryoverByFundSource,
} from "@/components/dashboard/services";
import store from "@/store";
import BarChart from "@/components/dashboard/components/charts/BarChart.vue";
import capitalize from "@/helpers/FormatHelper";

interface FormFilter {
  financial_year_id: string;
  location_id: string;
  region_id: string;
  council_id: string;
  fac_id: string;
}

interface Location {
  code: string;
  description: string;
  id: number;
  level: Level;
}

interface Level {
  id: number;
  code: string;
  name: string;
  position: number;
}

interface User {
  id: number;
  location: Location;
}

interface AdminArea {
  name: string;
  id: string;
  code: string;
  displayName: string;
  level?: Record<string, any>;
}

interface Facility {
  id: string;
  name: string;
  code: string;
  facility_type?: Record<string, any>;
  displayName: string;
  location?: Record<string, any>;
}

interface DashboardData {
  id: number;
  title: string;
  amount: number;
}

interface CurrentSource {
  description: string;
  code: string;
  fund_received: string;
}

interface ChartOptions {
  label: string;
  backgroundColor: Array<string>;
  borderColor: Array<string>;
  pointBorderColor: string;
  borderWidth: number;
  data: Array<string>;
}

interface BarChartData {
  labels: Array<string>;
  datasets: Array<ChartOptions>;
}

export default defineComponent({
  components: {
    EqualHeights,
    MoneyCard,
    BarChart,
  },

  setup() {
    const formData: FormFilter = {
      financial_year_id: "",
      location_id: "",
      fac_id: "",
      region_id: "",
      council_id: "",
    };

    const entries: Array<AdminArea> = [];
    const councils: Array<AdminArea> = [];
    const facilities: Array<Facility> = [];
    const cardData: Array<DashboardData> = [];
    let currentSource: BarChartData;
    let receivedVsPayments: any;
    const graphs = [1, 2, 3];
    const regionIsCurrentSelection: boolean = false;
    const isCouncil: boolean = false;
    const user: User = {
      id: null,
      location: {
        id: null,
        description: "",
        code: "",
        level: {
          name: "",
          id: null,
          code: "",
          position: null,
        },
      },
    };

    const data = reactive({
      formData,
      valid: false,
      cardData,
      entries,
      councils,
      graphs,
      user,
      facilities,
      regionIsCurrentSelection,
      receivedVsPayments,
      isCouncil,
      searchTerm: "",
      currentSource,
    });

    onMounted(() => {
      loadAdminAreas();
      loadDashboards();
      data.cardData = [];
    });

    interface Dashboard {
      balance: string;
      opening: string;
      payment: string;
      received: string;
      total_fund: string;
    }

    const setUpUser = async () => {
      const user = store.getters["Auth/getCurrentUser"];
      data.user = {
        ...user,
      };
    };

    const mapDashboards = (obj: Dashboard): Array<DashboardData> => {
      const results = [];
      Object.entries(obj).map((entry, idx) => {
        results.push({
          id: idx + 1,
          title: entry[0].split("_").join(" ").toUpperCase(),
          amount: entry[1] ? parseInt(entry[1]) : 0,
        });
      });
      return results;
    };

    const loadDashboards = async () => {
      const response = await get({});
      const _byMonthResponse = await byMonth({});
      const _byMonthMapped = mapByMonth(_byMonthResponse.data);
      const _carryoverBySourceResponse = await getCarryoverByFundSource({});
      const currResp = await getByCurrentSource({});
      console.log(_byMonthResponse.data);
      console.log("carryover by source:", _carryoverBySourceResponse.data);
      const _mappedCurrentSource = mapCurrentSource(currResp.data);
      const _mappedDashboards = mapDashboards(response.data[0]);

      data.cardData = _mappedDashboards;
      data.currentSource = _mappedCurrentSource;
      data.receivedVsPayments = _byMonthMapped;
    };

    const mapByMonth = (results: Array<any>) => {
      const labels = results.map((r) => capitalize(r.month));
      const _fundsReceived = results.map((r) => r.fund_received);
      const _payments = results.map((r) => r.payments);
      const fundsReceived = {
        label: "Funds Received",
        borderWidth: 1,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        pointBorderColor: "#2554FF",
        data: _fundsReceived,
        yAxisID: "y-axis-funds",
      };

      const payments = {
        label: "Payments Made",
        backgroundColor: "rgba(99, 132, 0, 0.6)",
        borderColor: "rgba(99, 132, 0, 1)",
        data: _payments,
      };

      const dataOptions = {
        labels,
        datasets: [fundsReceived, payments],
      };

      return dataOptions;
    };

    const mapCurrentSource = (results: Array<CurrentSource>): BarChartData => {
      const labels = results.map((result) => result.description);
      const data = results.map((result) => result.fund_received);

      const dataOptions: BarChartData = {
        labels,
        datasets: [
          {
            label: "Ammounts by current source",
            borderWidth: 1,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            pointBorderColor: "#2554FF",
            data: [...data],
          },
        ],
      };
      return dataOptions;
    };

    const mapAreas = <T extends AdminArea>(
      areas: Array<T>
    ): Array<AdminArea> => {
      return areas.map((area: T) => ({
        displayName: `${area.name}`,
        id: area.id,
        name: area.name,
        code: area.code,
      }));
    };

    const mapFacilities = <T extends Facility>(
      facilities: Array<T>
    ): Array<Facility> => {
      return facilities.map((facility: T) => ({
        id: facility.id,
        name: facility.name,
        code: facility.code,
        displayName: `${facility.name} (${facility.facility_type.name}) - ${facility.location.name}`,
      }));
    };

    const setLocationId = () => {
      if (
        !!data.formData.region_id &&
        !!data.formData.council_id &&
        !data.regionIsCurrentSelection
      ) {
        return data.formData.council_id;
      } else {
        return data.formData.region_id;
      }
    };

    const filterDashboard = async (isRegion: boolean = true) => {
      data.regionIsCurrentSelection = isRegion;

      const params = {
        ...data.formData,
        location_id: data.isCouncil
          ? data.user.location.id
          : isRegion
          ? data.formData.region_id
          : setLocationId(),
      };

      const response = await get(params);

      if (!data.formData.council_id || isRegion) {
        await getCouncils(data.formData.region_id);
      }

      if (!isRegion) {
        const res = await getFacilities({
          location_id: data.formData.council_id,
        });
        const _mappedFacilties = mapFacilities(res.data.data.data);
        data.facilities = _mappedFacilties;
      }

      const _mappedDashboards = mapDashboards(response.data[0]);
      data.cardData = _mappedDashboards;
    };

    const loadAdminAreas = async () => {
      await setUpUser();
      const locationId = data && data.user && data.user.location.id;
      const response = await getChildren(locationId);
      data.isCouncil = response.data.data.level_id === 3;
      const res = await getFacilities({
        per_page: 10,
        location_id: response.data.data.id,
      });
      const _mappedAreas = mapAreas(response.data.data.children);
      const _mappedFacilties = mapFacilities(res.data.data.data);
      data.facilities = _mappedFacilties;
      data.entries = _mappedAreas;
    };

    const getCouncils = async (regionId: string) => {
      const response = await getChildren(regionId);
      const _mappedAreas = mapAreas(response.data.data.children);
      data.councils = _mappedAreas;
    };

    const resetSearchText = async () => {
      data.searchTerm = "";
      const response = await getChildren();
      const _mappedAreas = mapAreas(response.data.data.children);
      data.entries = _mappedAreas;
    };

    const searchAdminAreas = async (val: string) => {
      const searchTerm = val ? val : data.searchTerm;
      const response = data.entries.filter((entry: AdminArea) =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const _mappedAreas = mapAreas(response);
      data.entries = _mappedAreas;
    };

    const searchFacilities = async (val: string) => {
      const searchTerm = val ? val : data.searchTerm;
      const response = await getFacilities({
        regSearch: searchTerm,
        location_id: data.formData.council_id
          ? data.formData.council_id
          : data.formData.region_id,
      });
      const _mappedFacilties = mapFacilities(response.data.data.data);
      data.facilities = _mappedFacilties;
    };

    const showSmallColumns = computed(() => {
      const val =
        !data.formData.region_id ||
        (!data.formData.council_id && !data.formData.region_id);
      return !!val;
    });

    return {
      data,
      searchAdminAreas,
      searchFacilities,
      filterDashboard,
      resetSearchText,
      showSmallColumns,
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
