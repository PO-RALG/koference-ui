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
              v-if="!isLowLevelUser() && data.councils.length > 0"
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
            <v-col cols="12" :md="showSmallColumns ? 4 : 3">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "vue";
import EqualHeights from "@/components/shared/equal-heights/EqualHeights.vue";
import MoneyCard from "@/components/dashboard/components/MoneyCard.vue";
import { getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";
import { get as getFacilities } from "@/components/facility/facility/services/facility.service";
import { get } from "@/components/dashboard/services";

interface FormFilter {
  financial_year_id: string;
  locaction_id: string;
  region_id: string;
  council_id: string;
  fac_id: string;
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

export default defineComponent({
  components: {
    EqualHeights,
    MoneyCard,
  },

  setup() {
    const formData: FormFilter = {
      financial_year_id: "",
      locaction_id: "",
      fac_id: "",
      region_id: "",
      council_id: "",
    };

    const entries: Array<AdminArea> = [];
    const councils: Array<AdminArea> = [];
    const facilities: Array<Facility> = [];
    const cardData: Array<DashboardData> = [];
    const regionIsCurrentSelection: boolean = false;

    const data = reactive({
      formData,
      valid: false,
      cardData,
      entries,
      councils,
      facilities,
      regionIsCurrentSelection,
      searchTerm: "",
    });

    onMounted(() => {
      loadAdminAreas();
      loadFacilities();
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

    const mapDashboards = (obj: Dashboard): Array<DashboardData> => {
      const results = [];
      Object.entries(obj).map((entry, idx) => {
        results.push({
          id: idx + 1,
          title: entry[0].split("_").join(" ").toUpperCase(),
          amount: parseInt(entry[1]),
        });
      });
      return results;
    };

    const loadDashboards = async () => {
      const response = await get({});
      const _mappedDashboards = mapDashboards(response.data[0]);
      data.cardData = _mappedDashboards;
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

    const filterDashboard = async (isRegion: boolean = true) => {
      data.regionIsCurrentSelection = isRegion;

      const params = {
        ...data.formData,
        locaction_id: isRegion
          ? data.formData.region_id
          : data.formData.council_id,
      };

      const response = await get(params);

      if (!data.formData.council_id || isRegion) {
        await getCouncils(data.formData.region_id);
      }

      const _mappedDashboards = mapDashboards(response.data[0]);
      data.cardData = _mappedDashboards;
    };

    const loadFacilities = async () => {
      const response = await getFacilities({ per_page: 10 });
      const _mappedFacilties = mapFacilities(response.data.data.data);
      data.facilities = _mappedFacilties;
    };

    const loadAdminAreas = async () => {
      const response = await getChildren();
      const _mappedAreas = mapAreas(response.data.data.children);
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
      const response = await getFacilities({ regSearch: searchTerm });
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
