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
      <AppLocationHeader
        :facility="facility"
        :facility-type="facility.facility_type"
        :location="facility.council"
        :title= "data.title"
        v-if="facility"
      />
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
              <th class="text-left">REFERENCE #</th>
              <th class="text-right">DR</th>
              <th class="text-right">CR</th>
              <th class="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr  v-for="(trx, index) in entries" :key="index">

              <td>{{ trx.date | format("MM/DD/YYYY") }}</td>
              <td>{{ trx.reference_no }}</td>
                 <td v-if="index == 0" class="text-right">-</td>
              <td v-else class="text-right">{{ trx.dr | toCurrency }}</td>
                <td v-if="index == 0" class="text-right">-</td>
              <td v-else class="text-right">{{ trx.cr | toCurrency }}</td>
              <td class="text-right">{{ trx.current_balance | toCurrency }}</td>

            </tr>

          </tbody>
        </template>
      </v-simple-table>
      <!--<pre>{{ entries }}</pre>-->
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
                  height="10"
                  :items="data.bankAccounts"
                  label="Bank Account"
                  :item-text="'name'"
                  item-value="id"
                  v-model="params.bank_account_id"
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
            <v-btn color="blue darken-1" text @click="closeDialog"
              >Cancel</v-btn
            >
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
import { defineComponent } from "vue";
import { useCashbookReport } from "./composables/cashbook-report";

export default defineComponent({
  name: "CashbookReport",
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
      entries
    } = useCashbookReport();

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
      entries
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
