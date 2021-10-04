<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn class="print-button d-print-none" @click="openPrintDialog">
        <v-icon class="pr-4 print-icon">mdi-printer</v-icon>
        <v-divider :vertical="true"></v-divider>
        <span class="pr-1 pl-2">Print</span>
      </v-btn>
    </v-card-actions>

    <v-card>
      <AppLocationHeader :facility="facility" v-if="facility" />
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr class="top-tr">
              <th class="text-left">DATE</th>
              <th class="text-left">INPUT</th>
              <th class="text-left">ACCOUNT #</th>
              <th class="text-left">DR</th>
              <th class="text-left">CR</th>
            </tr>
          </thead>
          <tbody v-for="(entry, index) in data.entries" :key="index">
            <tr class="ledger-header">
              <th colspan="5" class="account-th">{{ entry.account }} - {{ entry.account_description }}</th>
            </tr>
            <tr v-for="(trx, idx) in entry.transactions" :key="idx">
              <td>{{ trx.apply_date | format("MM/DD/YYYY") }}</td>
              <td>{{ trx.description }}</td>
              <td>{{ trx.account }}</td>
              <td>{{ trx.dr | toCurrency }}</td>
              <td>{{ trx.cr | toCurrency }}</td>
            </tr>
            <tr class="ledger-summary">
              <td class="account"></td>
              <td class="description"></td>
              <td class="sub_total" style="text-align: right">
                <span><strong>SUB TOTAL</strong></span>
              </td>
              <td class="total_dr" style="text-align: left">
                <span>{{ entry.dr_total | toCurrency }}</span>
              </td>
              <td class="total_cr" style="text-align: left">
                <span>{{ entry.cr_total | toCurrency }}</span>
              </td>
            </tr>
            <tr class="divider">
              <td colspan="8"></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useGLReport } from "./composables/gl-report";

export default defineComponent({
  setup() {
    const { data, facility, openPrintDialog } = useGLReport();
    return { data, facility, openPrintDialog };
  },
});
</script>

<style lang="scss" scoped>
tr.top-tr {
  background: #eeeeee;
}
tr.divider {
  height: 10px;
  background: #fafafa;
  width: 100%;
  td {
    border-bottom: 1px solid #ccc;
  }
}
th.account-th {
  text-transform: uppercase;
  font-weight: bold;
}
.sub_total,
.total_dr,
.total_cr {
  font-weight: bold;
}
.total_cr,
.total_dr {
  border-top: 2px solid #000;
  border-bottom: 5px double #000 !important;
}
.print-button {
  span {
    font-weight: bold;
  }
}
</style>
