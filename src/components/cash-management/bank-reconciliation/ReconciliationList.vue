<template>
  <div>
    <v-card-actions :class="headerPadding">
      <h2>Bank Reconciliation</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="navigateBack()"
        v-if="can('addBalance', 'Reconciliation')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card :class="cardPadding">
      <v-divider></v-divider>
      <v-data-table
        v-if="data.ENTRIES"
        :class="elevation"
        :headers="data.HEADERS"
        :items="entries"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:[`item.confirmed`]="{ item }">
          <span>{{ item.confirmed ? "RECONCILED" : "NOT RECONCILED" }}</span>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom v-if="can('unlockReport', 'Reconciliation')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="!item.confirmed"
                medium
                color="warning"
                v-bind="attrs"
                v-on="on"
              >
                mdi-lock-open
              </v-icon>
              <v-icon
                v-else
                medium
                color="success"
                v-bind="attrs"
                v-on="on"
                @click="openUnlockDialog(item)"
              >
                mdi-lock
              </v-icon
              >
            </template>
            <span>{{ !item.confirmed ? "" : "UnLock Reconciliation" }}</span>
          </v-tooltip>
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
    <ConfirmDialog
      @rejectFunction="closeUnlockDialog"
      @acceptFunction="unlock"
      :message="'Are you sure you want to unlock?'"
      :isOpen="reconciliationData.isUnlockOpen"
      :title="`Unlock Report`"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, computed } from "vue";
import { get } from "./services/bank-reconciliation-service";
import { AxiosResponse } from "axios";
import moment from "moment";
import router from "@/router";
import { useBankReconciliation } from "./composables/use-reconciliation";

export default defineComponent({
  props: {
    headerPadding: {
      type: String,
      required: false,
      default: "pa-0",
    },
    cardPadding: {
      type: String,
      required: false,
      default: "pa-0",
    },
    elevation: {
      type: String,
      required: false,
      default: "elevation-2",
    },
  },
  setup(context) {
    const {
      data: reconciliationData,
      closeUnlockDialog,
      openUnlockDialog,
      unlock,
    } = useBankReconciliation(context);

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
        { text: "Actions", value: "actions", sortable: false },
      ],
      response: {},
      ENTRIES: [],
      rows: ["10", "20", "50", "60", "100"],
      unlockDialogOpen: false,
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
        entry_date: entry.month,
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
      reconciliationData,
      closeUnlockDialog,
      openUnlockDialog,
      unlock,
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
