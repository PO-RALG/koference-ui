<template>
  <div>
    <v-card-actions class="pa-0">
      <h2> Bank Reconciliation</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="navigateBack()"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card class="elevation-0">
      <v-divider></v-divider>
      <v-data-table
        v-if="data.ENTRIES"
        class="elevation-2"
        :headers="data.HEADERS"
        :items="entries"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:[`item.confirmed`]="{ item }">
          <span>{{ item.confirmed ? "RECONCILED" : "NOT RECONCILED" }}</span>
        </template>

        <template v-slot:footer>
          <Paginate
            :params="data.response"
            :rows="data.rows"
            @onPageChange="fetchData"
          />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  computed,
} from "vue";
import { get } from "./services/bank-reconciliation-service";
import { AxiosResponse } from "axios";
import moment from "moment";
import router from "@/router";

export default defineComponent({
  setup(context) {

    const data = reactive({
      HEADERS: [
        { text: "Month ", value: "month" },
        { text: "Cash Balance", value: "cash_balance", sortable: false },
        { text: "Bank Balance", value: "bank_balance", sortable: false },
        { text: "Cash On Transit", value: "cash_on_transit", sortable: false },
        {
          text: "Unpresented Cheque",
          value: "un_presented_cheque",
          sortable: false,
        },
        {
          text: "Adjusted Balance",
          align: "start",
          sortable: true,
          value: "adjusted_balance",
        },
        { text: "Status", value: "confirmed", sortable: true },
      ],
      response: {},
      ENTRIES: [],
      rows: ["10", "20", "50", "60", "100"],
    });

    onMounted(() => {
      loadEntries();
    });

    const formatDate = (date) => {
      const entry = moment(date, "DD-MM-YYYY");
      return entry.format("MMMM");
    };

    const entries = computed(() => {
      return data.ENTRIES.map((entry) => ({
        ...entry,
        month: formatDate(entry.month),
      }));
    });

    const fetchData = async (params: any) => {
      const query = {
        ...params,
      };
      data.response = query;
      get(query).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.ENTRIES = response.data.data.data;
      });
    };

    const loadEntries = () => {
      get({}).then((response) => {
        const { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.ENTRIES = response.data.data.data;
      });
    };

    const navigateBack = () => {
      router.push({ path: `/bank-reconciliation` });
    };

    return {
      data,
      entries,
      fetchData,
      navigateBack,
    };
  },
});
</script>

<style lang="scss">
.border-right {
  border-right: 1px solid #ccc;
}
.border-bottom {
  background: #fbfbfb;
}
.border-top {
  background: #efedec;
}
.adjustable {
  cursor: pointer;
}
</style>
