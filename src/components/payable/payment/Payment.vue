<template>
  <div class="Payment">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'Payment')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        hide-default-footer
        class="elevation-1"
        disable-pagination
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Reference number"
                @change="searchItem($event)"
                :items="data.itemsToFilter"
                :item-text="'reference_no'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.payment_date`]="{ item }">
          <span>{{ item.payment_date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.bank_account`]="{ item }">
          <span>{{ item.bank_account.number }}({{ item.bank_account.name }})</span>
        </template>
        <template v-slot:[`item.voucher`]="{ item }">
          <span>
            <v-list-item exact light @click="previewPaymentVoucher(item.voucher.id)">
              {{item.voucher.reference_no}}</v-list-item>
          </span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            @click="openRequestReversalDialog(item.id)"
            :disabled="cant('delete', 'Payment')"
          >
            mdi-undo
          </v-icon>
          <v-icon
            @click="openHistoryDialog(item.id)"
            :disabled="cant('delete', 'Payment')"
          >
            mdi-update
          </v-icon>
        </template>
        <template v-slot:footer>
          <Paginate
            :params="data.response"
            :rows="data.rows"
            @onPageChange="getData"
          />
        </template>
      </v-data-table>
    </v-card>

    <Modal :modal="data.modal" :width="1260">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Payment`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row class="pa-2 pb-5">
                <v-col cols="12" md="3">
                  <DatePicker
                    :label="'Date'"
                    v-model="data.formData.payment_date"
                    required
                  />
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-select
                    v-model="data.formData.bank_account_id"
                    :items="data.bankAccounts"
                    item-text="name"
                    item-value="id"
                    label="Select Bank Account"
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-select
                    v-model="data.formData.cheque_type"
                    :items="data.chequeTypes"
                    label="Select Cheque Type"
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-text-field
                    v-model="data.formData.cheque"
                    label="Cheque"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-select
                    v-model="data.formData.voucher_id"
                    :items="data.paymentVouchers"
                    item-text="reference_no"
                    item-value="id"
                    label="Select PV"
                    @change="setPayableItems($event)"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="9" sm="12">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
                  ></v-text-field>
                </v-col>
              </v-row>
              <template>
                <v-col cols="12" md="12" class="data-table">
                  <v-data-table
                    :headers="payableHeader"
                    disable-pagination
                    hide-default-footer
                  >
                    <template v-slot:body>
                      <tbody>
                        <tr v-for="(payable, i) in data.payables" :key="i">
                          <td>
                            <v-select
                              class="pt-3"
                              outlined
                              dense
                              v-model="payable.payable_id"
                              :items="data.payableItems"
                              item-text="description"
                              item-value="id"
                              @change="setAmount($event,i)"
                            >
                            </v-select>
                          </td>
                          <td>
                            {{payable.required_amount | toCurrency()}}
                          </td>
                          <td>
                            {{payable.paid_amount | toCurrency()}}
                          </td>
                          <td>
                            <v-text-field
                              class="pt-3"
                              outlined
                              dense
                              type="number"
                              v-model="payable.amount"
                              :rules="[maxRules(payable.balance)]"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-btn v-if="data.payables.length > 1" text @click="removePayable(i)">
                              <v-icon color="red darken-1">mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-btn v-if="data.payables.length == i+1" text @click="addPayable">
                              <v-icon color="green darken-1">mdi-plus-circle</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </v-col>
              </template>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="save"
            :disabled="!data.valid"
          >
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Payment `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.paymentVoucherModal" :width="1000">
      <template v-slot:header>
        <ModalHeader :title="`Payment Voucher`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="invoice-box" v-if="data.pvDetails">
            <v-col class="d-flex justify-center">
              <div class="text-h6 text-center">
                THE UNITED REPUBLIC OF TANZANIA <br />
                REGIONAL ADMIN AND LOCAL GOVERNMENT <br />
                REGION <br />
              </div>
            </v-col>
            <v-col class="d-flex justify-center">
              <div class="text-subtitle-1 font-weight-bold">PAYMENT VOUCHER</div>
            </v-col>
            <table width="100%">
              <tr class="top">
                <td>
                  <span>STATION NO: ............</span>
                </td>
                <td class="d-flex justify-end">
                  <span>REF NO: </span><span class="font-weight-bold">{{data.pvDetails.reference_no}}</span>
                </td>
              </tr>
              <tr>
                <td width="100%" colspan="3" class="d-flex justify-center"></td>
              </tr>

              <!-- <v-data-table
                :headers="HEADERS_INVOICE_DETAILS"
                :items="newInvoiceItem"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:[`item.no`]="{ index }">
                  <tr class="text--bold">
                    {{
                      index + 1
                    }}
                  </tr>
                </template>
                <template v-slot:[`item.item`]="{ item }">
                  <tr class="text--bold">
                    {{
                      item.definition.name
                    }}
                  </tr>
                </template>
                <template v-slot:[`item.received_amount`]="{ item }">
                  <tr class="text--bold">
                    {{
                      item.received_amount | toCurrency()
                    }}
                  </tr>
                </template>
                <template v-slot:[`item.amount`]="{ item }">
                  <tr class="text--bold">
                    {{
                      item.amount | toCurrency()
                    }}
                  </tr>
                </template>
                <template v-slot:[`item.balance_amount`]="{ item }">
                  <tr class="text--bold">
                    {{
                      (item.amount - item.received_amount) | toCurrency()
                    }}
                  </tr>
                </template>

                <template v-slot:[`body.append`]="{ headers }">
                  <tr>
                    <th
                      class="grey lighten-5"
                      v-for="(header, i) in headers"
                      :key="i"
                    >
                      <div v-if="header.value == 'no'">
                        <h2>
                          {{ "TOTAL" }}
                        </h2>
                      </div>
                      <span v-if="header.value == 'amount'">
                        <h2 class="underline-amount">
                          {{ sumDebts.sumamount | toCurrency() }}
                        </h2>
                      </span>
                      <span v-if="header.value == 'received_amount'">
                        <h2 class="underline-amount">
                          {{ sumDebts.sumamountReceived | toCurrency() }}
                        </h2>
                      </span>
                      <span v-if="header.value == 'balance_amount'">
                        <h2 class="underline-amount">
                          {{ sumDebts.sumamountPending | toCurrency() }}
                        </h2>
                      </span>
                    </th>
                  </tr>
                </template>
              </v-data-table> -->
            </table>
          </div>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelPreviewDialog">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="printPaymentVoucher"
            :disabled="!data.valid"
          >
            Print
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { usePayment } from "./composables/payment";

export default defineComponent({
  name: "Payment",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openRequestReversalDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      addPayable,
      removePayable,
      setPayableItems,
      setAmount,
      maxRules,
      payableHeader,
      openHistoryDialog,
      previewPaymentVoucher,
      cancelPreviewDialog,
      printPaymentVoucher,
    } = usePayment();

    return {
      data,
      openDialog,
      cancelDialog,
      openRequestReversalDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      addPayable,
      removePayable,
      setPayableItems,
      setAmount,
      maxRules,
      payableHeader,
      openHistoryDialog,
      previewPaymentVoucher,
      cancelPreviewDialog,
      printPaymentVoucher,
    };
  },
});
</script>

<style lang="scss">
.data-table {
  table {
    border: 1px solid #cccc;
    thead {
      th {
        border-right: 1px solid #ccc;
        &:last-child {
          border-right: none;
        }
        &:nth-last-child(2) {
          border-right: none;
        }
      }
    }
    
    tr {
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    
    td {
      border-right: 1px solid #ccc;
      &:last-child {
        border-right: none;
      }
    }
  }
}
</style>
