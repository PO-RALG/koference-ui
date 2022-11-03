<template>
  <div>
    <v-card elevation="1" class="mt-10 pt-5 pl-5 pr-5 mb-0 top-card">
      <v-form ref="form" v-model="data.valid">
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                :items="data.entries"
                label="Select Admin Area"
                outlined
                v-model="data.formData.admin_hierarchy_id"
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
                      ></v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="4">
              <fetcher :api="'/api/v1/financial-years'">
                <div slot-scope="{ json: entries, loading }">
                  <div v-if="loading">Loading...</div>
                  <BaseSelect
                    v-else
                    :items="entries"
                    :item-text="'name'"
                    label="Financial Year"
                    outlined
                    v-model="data.formData.financial_year_id"
                  />
                </div>
              </fetcher>
            </v-col>
            <v-col cols="12" md="4">
              <fetcher :api="'/api/v1/financial-years'">
                <div slot-scope="{ json: entries, loading }">
                  <div v-if="loading">Loading...</div>
                  <BaseSelect
                    v-else
                    :items="entries"
                    :item-text="'name'"
                    label="Facility"
                    outlined
                    v-model="data.formData.financial_year_id"
                  />
                </div>
              </fetcher>
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
            lg="3"
            sm="12"
            class="border-right"
            v-for="entry in data.cardData"
          >
            <MoneyCard
              key="{entry.title}"
              :title="entry.title"
              :amount="entry.amount"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import EqualHeights from "@/components/shared/equal-heights/EqualHeights.vue";
import MoneyCard from "@/components/dashboard/components/MoneyCard.vue";
import { get as getAdminAreas } from "@/components/admin-area/admin-area/services/admin-area-services";

interface FormFilter {
  financial_year_id: string;
  admin_hierarchy_id: string;
  facility_id: string;
}

interface AdminArea {
  name: string;
  id: string;
  code: string;
  displayName: string;
  level?: Record<string, any>;
}

interface CardData {
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
      admin_hierarchy_id: "",
      facility_id: "",
    };

    const entries: Array<AdminArea> = [];
    const cardData: Array<CardData> = [];

    const data = reactive({
      formData,
      valid: false,
      cardData,
      entries,
      searchTerm: "",
    });

    onMounted(() => {
      loadAdminAreas();
      data.cardData = [
        {
          title: "OPENING BALANCE",
          amount: 12323200.58,
        },
        {
          title: "FUND RECEIVED",
          amount: 10000000000,
        },
        {
          title: "TOTAL FUNDS",
          amount: 2322302328232.48,
        },
        {
          title: "FUND RECEIVED",
          amount: 23000000,
        },
      ];
    });

    const mapAreas = <T extends AdminArea>(
      areas: Array<T>
    ): Array<AdminArea> => {
      return areas.map((area: T) => ({
        displayName: `${area.name} (${area.level.name})`,
        id: area.id,
        name: area.name,
        code: area.level.name,
      }));
    };

    const loadAdminAreas = async () => {
      const response = await getAdminAreas({ per_page: 10 });
      const _mappedAreas = mapAreas(response.data.data.data);
      data.entries = _mappedAreas;
    };

    const searchAdminAreas = async (val: string) => {
      const searchTerm = val ? val : data.searchTerm;
      const response = await getAdminAreas({ regSearch: searchTerm });
      const _mappedAreas = mapAreas(response.data.data.data);
      data.entries = _mappedAreas;
    };

    return {
      data,
      searchAdminAreas,
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
