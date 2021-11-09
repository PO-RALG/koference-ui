<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog('BALANCE')"
        :disabled="cant('addBalance', 'Reconciliation')"
      >
        <v-icon>mdi-plus</v-icon>
        Add Bank Balance
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-card-actions class="justify-center" v-if="!data.selectedEntries.length">
        <v-btn @click="openDialog('LOAD')" class="ma-2" outlined color="black">
          <v-icon>mdi-progress-download</v-icon>
          Load Cashbook Entries
        </v-btn>
      </v-card-actions>
      <v-simple-table v-if="data.entries.length">
        <template v-slot:default>
          <thead>
            <tr class="border-top">
              <th class="text-left border-right">BALANCE AS PER BANK</th>
              <th class="text-left border-right">OUTSTANDING DEPOSITS</th>
              <th class="text-left border-right">OUTSTANDING PAYMENTS</th>
              <th class="text-left border-right">ADJUSTED BANK BALANCE</th>
              <th class="text-left border-right">BOOK BALANCE</th>
              <th class="text-left border-right">UNRECONCILED DIFFERENCE</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-bottom">
              <td class="border-right"><strong>1,050,000.00</strong></td>
              <td class="border-right"><strong>400,000.00</strong></td>
              <td class="border-right"><strong>23,000.00</strong></td>
              <td class="border-right"><strong>1,427,000.00</strong></td>
              <td class="border-right"><strong>5,637,000.00</strong></td>
              <td><strong>4,210,000.00</strong></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-toolbar color="primary" v-if="data.selectedEntries.length" class="elevation-0">
        <v-row class="ml-auto">
          <v-col>
            <v-btn text color="white">
              {{ data.selectedEntries.length }} Entries Selected
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              @click="reconcileEntries(status)"
              color="white"
              text
              v-for="status in data.statuses"
              :key="status"
            >
              {{ status }}
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-data-table
        class="elevation-2"
        :headers="data.headers"
        :items="data.entries"
        show-select
        hide-default-footer
        v-model="data.selectedEntries"
        disable-pagination>
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="fetchData" />
        </template>
      </v-data-table>

      <Modal :modal="data.dialog" :width="600">
      <template v-slot:header>
        <ModalHeader :title="data.dialogTitle" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
        <v-form ref="form" v-model="data.valid" class="pa-3">
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <vuetify-money
                  v-if="data.showBalance"
                  v-model="data.formData.balance"
                  outlined
                  required
                  :clearable="data.clearable"
                  :rules="data.balanceRules"
                  :valueWhenIsEmpty="data.valueWhenIsEmpty"
                  :options="data.options"
                  label="Account Balance"
                  >
                </vuetify-money>
              </v-col>
              <v-col cols="12" md="12" class="mt-n8">
                <fetcher :api="'/api/v1/bank-accounts'">
                <div slot-scope="{ json: items, loading }">
                  <div v-if="loading">Loading...</div>
                  <BaseSelect
                    v-else
                    :items="items"
                    :item-text="'name'"
                    :label="'Select Bank Account'"
                    :rules="data.accountRules"
                    outlined
                    required
                    v-model="data.formData.bank_account_id"
                    />
                </div>
                </fetcher>
              </v-col>
              <v-col cols="12" md="12" class="mt-n8">
                <v-dialog ref="dialog" v-model="data.modal" :return-value.sync="data.date" persistent width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="data.formData.date"
                      label="Select Month"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="data.formData.date"
                    type="month"
                    scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="data.modal = false" >
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(data.date)" > OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
        <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
        <v-btn color="green darken-1" :disabled="!data.valid" text @click="save">{{ data.buttonTitle }}</v-btn>
        </ModalFooter>
      </template>
      </Modal>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useBankReconciliation } from "./composables/use-reconciliatoin";
export default defineComponent({
  setup(_, context) {
    const { data, fetchData, openDialog, cancelDialog, save, reconcileEntries } = useBankReconciliation(context);

    return {
      data,
      fetchData,
      openDialog,
      cancelDialog,
      save,
      reconcileEntries,
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
</style>
