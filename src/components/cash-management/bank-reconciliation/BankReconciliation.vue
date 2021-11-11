<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!data.report || !data.report.confirmed"
        color="primary"
        @click="openDialog('BALANCE')"
        :disabled="cant('addBalance', 'Reconciliation')"
      >
        <v-icon>mdi-plus</v-icon>
        Add Bank Balance
      </v-btn>
      <v-btn v-if="data.report && data.report.confirmed" color="green">
        <v-icon small>mdi-lock</v-icon>
        Report Locked
      </v-btn>
      <v-btn v-if="data.report && data.report.confirmed" color="red" @click="openUnlockDialog()">
        <v-icon small>mdi-lock-open-outline</v-icon>
        Unlock Report
      </v-btn>
    </v-card-actions>
    <v-card class="elevation-0">
      <v-card-actions class="justify-center" v-if="!data.selectedEntries.length">
        <v-btn
          @click="openDialog('LOAD')"
          class="ma-2"
          outlined
          color="black"
          v-if="!data.report || !data.report.confirmed"
        >
          <v-icon>mdi-progress-download</v-icon>
          Load Cashbook Entries
        </v-btn>
      </v-card-actions>
      <v-simple-table v-if="data.report">
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
              <td class="border-right adjustable" @click="rowClicked(data.report)">
                <strong v-if="!data.showEdit">{{ data.report.bank_balance | toCurrency }}</strong>
                <v-form v-else ref="form" @submit.prevent="updateBalance">
                  <v-row>
                    <v-col cols="6" md="5" sm="3">
                      <v-text-field v-model="data.report.bank_balance" dense> </v-text-field>
                    </v-col>
                    <v-col cols="6" md="1" sm="3" class="mt-1">
                      <v-btn color="green" class="white--text" type="submit" dense> Save </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </td>
              <td class="border-right">
                <strong>{{ outstandingDeposits | toCurrency }}</strong>
              </td>
              <td class="border-right">
                <strong>{{ outstandingPayments | toCurrency }}</strong>
              </td>
              <td class="border-right">
                <strong>{{ data.report.adjusted_balance | toCurrency }}</strong>
              </td>
              <td class="border-right">
                <strong>{{ data.report.cash_balance | toCurrency }}</strong>
              </td>
              <td>
                <strong>{{ diff | toCurrency }}</strong>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider></v-divider>
      <v-card-actions class="pa-4 elevation-4" v-if="data.selectedEntries.length">
        <v-btn text color="primary"> {{ data.selectedEntries.length }} Entries Selected </v-btn>
        <v-spacer v-if="data.report"></v-spacer>
        <v-btn @click="reconcileEntries(status)" color="primary" v-for="status in data.statuses" :key="status">
          <v-icon>mdi-plus</v-icon>
          {{ status }}
        </v-btn>
      </v-card-actions>
      <v-data-table
        v-if="entries.length"
        class="elevation-2"
        :headers="data.headers"
        :items="entries"
        show-select
        hide-default-footer
        v-model="data.selectedEntries"
        disable-pagination
      >
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.dr_amount`]="{ item }">
          <span>{{ item.dr_amount | toCurrency }}</span>
        </template>
        <template v-slot:[`item.cr_amount`]="{ item }">
          <span>{{ item.cr_amount | toCurrency }}</span>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <span>{{ item.type }}</span>
        </template>
        <template v-slot:footer>
          <!--<Paginate :params="data.response" :rows="data.rows" @onPageChange="fetchData" />-->
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
                    <v-text-field
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
                    </v-text-field>
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
                          v-on="on"
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker v-model="data.formData.date" type="month" :max="currentDate" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="data.modal = false"> Cancel </v-btn>
                        <v-btn text color="primary" @click="$refs.dialog.save(data.date)"> OK</v-btn>
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

      <ConfirmDialog
        @rejectFunction="closeConfirmDialog"
        @acceptFunction="confirmReconciliation"
        :message="'Are you sure you want to confirm?'"
        :data="data.report"
        :isOpen="data.isOpen"
        :title="`Confirm Reconciliation`"
      />

      <ConfirmDialog
        @rejectFunction="closeUnlockDialog"
        @acceptFunction="unlock"
        :message="'Are you sure you want to unlock?'"
        :isOpen="data.isUnlockOpen"
        :title="`Unlock Report`"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useBankReconciliation } from "./composables/use-reconciliation";
export default defineComponent({
  setup(_, context) {
    const {
      data,
      fetchData,
      openDialog,
      cancelDialog,
      save,
      reconcileEntries,
      outstandingDeposits,
      outstandingPayments,
      showConfirmDialog,
      closeConfirmDialog,
      confirmReconciliation,
      diff,
      rowClicked,
      currentDate,
      entries,
      closeUnlockDialog,
      openUnlockDialog,
      unlock,
      updateBalance,
    } = useBankReconciliation(context);

    return {
      data,
      fetchData,
      openDialog,
      cancelDialog,
      save,
      reconcileEntries,
      outstandingDeposits,
      outstandingPayments,
      showConfirmDialog,
      closeConfirmDialog,
      confirmReconciliation,
      diff,
      rowClicked,
      currentDate,
      entries,
      closeUnlockDialog,
      openUnlockDialog,
      unlock,
      updateBalance,
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
