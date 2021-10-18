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
        <template v-slot:top>
          <v-card-actions class="d-print-none">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openDialog">
              <v-icon>mdi-filter</v-icon>
              Filter Report
            </v-btn>
          </v-card-actions>
        </template>
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
              <th{{ item.id }} colspan="5" class="account-th">{{ entry.account }} - {{ entry.account_description }}</th>
            </tr>
            <tr v-for="(trx, idx) in entry.transactions" :key="idx">
              <td>{{ trx.apply_datedata |  format("MM/DD/YYYY") }}</td>
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

    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="'Filter Report'" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-container fluid>
            <v-row>
              <v-col cols="12" lg="12" md="12" sm="12" class="mt-5">
                <v-select
                  class="pr-3 pl-3"
                  :items="data.financialYears"
                  :item-text="'name'"
                  return-object
                  height="10"
                  v-model="params.financial_year"
                  @change="showDateSelection()"
                  label="Financial Year"
                  outlined
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row class="pr-5 pl-5 mt-n8" v-if="data.showDateSelection">
              <v-col cols="12" lg="6" md="6" sm="12">
                <DatePicker
                  :label="'Start Date'"
                  v-model="params.start_date"
                  :min="data.minDate"
                  :max="data.maxDate"
                  @click="validateDate"
                  @dateSelectionEvent="dateSelected"
                />
              </v-col>

              <v-col cols="12" lg="6" md="6" sm="12">
                <DatePicker
                  :label="'End Date'"
                  v-model="params.end_date"
                  :min="data.minDate"
                  :max="data.maxDate"
                  @click="validateDate"
                  @dateSelectionEvent="dateSelected"
                />
              </v-col>
            </v-row>

            <v-row class="pr-3 pl-3">
              <v-col cols="12" lg="6" md="6" sm="12">
                <v-select
                  :items="gfsCodes"
                  :item-text="'name'"
                  label="From GFS"
                  v-model="params.from_gfs"
                  item-value="code"
                  height="10"
                  outlined
                >
                </v-select>
              </v-col>

              <v-col cols="12" lg="6" md="6" sm="12">
                <v-select
                  height="10"
                  :items="gfsCodes"
                  label="To GFS"
                  :item-text="'name'"
                  item-value="code"
                  v-model="params.to_gfs"
                  outlined
                >
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <div class="mt-n8 pb-4">
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="primary" @click="filterReport" class="mr-3">
              <v-icon>mdi-filter</v-icon>
              Filter Report
            </v-btn>
          </div>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useGLReport } from "./composables/gl-report";

export default defineComponent({
  setup() {
    const {
      data,
      facility,
      openPrintDialog,
      params,
      showDateSelection,
      openDialog,
      closeDialog,
      validateDate,
      dateSelected,
      filterReport,
      gfsCodes,
    } = useGLReport();

    return {
      data,
      facility,
      openPrintDialog,
      params,
      showDateSelection,
      openDialog,
      closeDialog,
      validateDate,
      dateSelected,
      filterReport,
      gfsCodes,
    };
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

.v-label {
  font-size: 10px;
}
.filter-container {
  border: 1px dashed #ccc;
}
</style>
