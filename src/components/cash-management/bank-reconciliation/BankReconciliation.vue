<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ title }}</h2>
      <v-spacer></v-spacer>
      <v-btn @click="navigateToList()" class="ma-2" outlined color="black">
        <v-icon>mdi-arrow-u-left-top</v-icon>
        Go To Reconciliations List
      </v-btn>
      <v-btn v-if="data.report && data.report.confirmed" color="green">
        <v-icon small>mdi-lock</v-icon>
        Report Locked
      </v-btn>
      <v-btn
        v-if="data.report && data.report.confirmed"
        color="red"
        @click="openUnlockDialog()"
      >
        <v-icon small>mdi-lock-open-outline</v-icon>
        Unlock Report
      </v-btn>
      <v-btn
        :disabled="
          (data.report && data.report.confirmed) ||
          !data.showConfirm ||
          data.diff > 0
        "
        color="primary"
        @click="showConfirmDialog()"
      >
        <v-icon small>mdi-lock-open-outline</v-icon>
        Confirm Reconciliation
      </v-btn>
    </v-card-actions>
    <v-card class="elevation-0">
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
            <tr class="border-bottom" style="background: #f2f2f2">
              <td
                class="border-right adjustable"
                @click="rowClicked(data.report)"
              >
                <strong v-if="!data.showEdit">{{
                  data.report.bank_balance | toCurrency
                }}</strong>
                <v-form v-else ref="form" @submit.prevent="updateBalance">
                  <v-row class="mt-2">
                    <v-col>
                      <v-text-field
                        v-mask="toMoney"
                        v-model="data.report.bank_balance"
                        dense
                        outlined
                      >
                      </v-text-field>
                    </v-col>
                    <v-col>
                      <v-btn
                        color="primary"
                        class="white--text"
                        type="submit"
                        dense
                      >
                        Save
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </td>
              <td class="border-right">
                <strong>{{ data.report.cash_on_transit | toCurrency }}</strong>
              </td>
              <td class="border-right">
                <strong>{{
                  data.report.un_presented_cheque | toCurrency
                }}</strong>
              </td>
              <td class="border-right">
                <strong>{{ data.report.adjusted_balance | toCurrency }}</strong>
              </td>
              <td class="border-right">
                <strong>{{ data.report.cash_balance | toCurrency }}</strong>
              </td>
              <td>
                <strong>{{
                  data.report.diff ? data.report.diff : diff | toCurrency
                }}</strong>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider></v-divider>
      <v-data-table
        v-if="entries.length"
        class="elevation-2"
        :headers="data.headers"
        :items="entries"
        :show-select="data.report && !data.report.confirmed"
        single-select
        hide-default-footer
        @item-selected="reconcileEntry"
        v-model="data.selectedEntries"
        disable-pagination
      >
        <template v-slot:header.dr_amount="{ header }">
          {{ header.text.toUpperCase() }}
        </template>
        <template v-slot:header.cr_amount="{ header }">
          {{ header.text.toUpperCase() }}
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.dr_amount`]="{ item }">
          <span>{{ item.dr_amount | toCurrency }}</span>
        </template>
        <template v-slot:[`item.cr_amount`]="{ item }">
          <span>{{ item.cr_amount | toCurrency }}</span>
        </template>
        <template v-slot:[`item.type`]="{ item }">
          <span>{{ item.type }}</span>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-icon v-if="item.status" medium color="success">mdi-check</v-icon>
          <v-icon v-else medium color="warning">mdi-close</v-icon>
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
                    <v-dialog
                      ref="dialog"
                      v-model="data.modal"
                      :return-value.sync="data.date"
                      persistent
                      width="290px"
                    >
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
                      <v-date-picker
                        v-model="data.formData.date"
                        type="month"
                        :max="currentDate"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="data.modal = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog.save(data.date)"
                        >
                          OK</v-btn
                        >
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
            <v-btn color="red darken-1" text @click="cancelDialog"
              >Cancel</v-btn
            >
            <v-btn color="primary" :disabled="!data.valid" text @click="save">{{
              data.buttonTitle
            }}</v-btn>
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
    <!-- <pre>{{ data.report | json }}</pre> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useBankReconciliation } from "./composables/use-reconciliation";
import { toMoney } from "@/filters/CurrencyFormatter";
import router from "@/router";
export default defineComponent({
  setup(_, context) {
    const {
      data,
      fetchData,
      openDialog,
      cancelDialog,
      save,
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
      title,
      reconcileEntry,
      selected,
    } = useBankReconciliation(context);

    const navigateToList = () => {
      router.push({ path: `/bank-reconciliation/list` });
    };

    return {
      data,
      fetchData,
      openDialog,
      cancelDialog,
      save,
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
      title,
      reconcileEntry,
      selected,
      navigateToList,
      toMoney,
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
