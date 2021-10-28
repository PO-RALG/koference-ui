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
          <span>
            {{ item.bank_account.number }}({{ item.bank_account.name }})
          </span>
        </template>
        <template v-slot:[`item.voucher`]="{ item }">
          <span>
            <v-list-item
              class="text-link"
              exact
              light
              @click="previewPaymentVoucher(item.voucher.id)"
            >
              {{ item.voucher.reference_no }}
            </v-list-item>
          </span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="openRequestReversalDialog(item.id)"
                :disabled="cant('delete', 'Payment')"
              >
                mdi-undo
              </v-icon>
            </template>
            <span>Reverse Payment</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="openHistoryDialog(item.id)"
                :disabled="cant('delete', 'Payment')"
              >
                mdi-update
              </v-icon>
            </template>
            <span>View  History for the approval requests and responses</span>
          </v-tooltip>
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
                <v-col cols="12" md="12" class="data-table" v-if="data.formData.voucher_id">
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
                              @change="setAmount($event, i)"
                            >
                            </v-select>
                          </td>
                          <td>
                            {{ payable.required_amount | toCurrency() }}
                          </td>
                          <td>
                            {{ payable.paid_amount | toCurrency() }}
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
                            <v-btn
                              v-if="data.payables.length > 1"
                              text
                              @click="removePayable(i)"
                            >
                              <v-icon color="red darken-1">
                                mdi-minus-circle
                              </v-icon>
                            </v-btn>
                            <v-btn
                              v-if="data.payables.length == i + 1"
                              text
                              @click="addPayable"
                            >
                              <v-icon color="green darken-1">
                                mdi-plus-circle
                              </v-icon>
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

    <Modal :fullScreen="true" :modal="data.paymentVoucherModal" :width="1260">
      <template v-slot:header>
        <ModalHeader :title="`Payment Voucher`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="" v-if="data.pvDetails">
            <v-col class="d-flex justify-center">
              <div class="font-weight-bold text-center">
                <img :src="data.coat" class="login-logo pt-5" /><br />  
                The United Republic of Tanzania <br />
                President's Office Regional Administration and Local Government <br />
                {{data.pvDetails.council?data.pvDetails.council.name:""}} <br />
                {{data.pvDetails.facility.name }} {{data.pvDetails.facility.facility_type.name }}<br />
              </div>
            </v-col>
            <v-col class="d-flex justify-center">
              <div class="text-subtitle-1 font-weight-bold">
                PAYMENT VOUCHER
              </div>
            </v-col>
            <v-col>
              <table width="100%">
                <tr>
                  <td class="pb-5">
                    <span>STATION NO: ............</span>
                  </td>
                  <td class="text-right pb-7">
                    <span>PV NO: </span>
                    <span class="font-weight-bold">
                      {{ data.pvDetails.reference_no }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-left">
                    <span class="font-weight-bold">Payee's name: </span>
                    {{ data.pvDetails.supplier.name }}<br />
                    <span class="font-weight-bold">Mobile #: </span>
                    {{ data.pvDetails.supplier.phone }}<br />
                    <span class="font-weight-bold">Address: </span>
                    {{ data.pvDetails.supplier.address }}<br />
                    <span class="font-weight-bold">TIN: </span>
                    {{ data.pvDetails.supplier.tin }}<br />
                  </td>
                  <td class="text-right">
                    <span class="font-weight-bold">Apply date: </span>
                    {{ data.pvDetails.date | format("DD/MM/YYYY") }}<br />
                    <span class="font-weight-bold">SBC: </span>
                    {{ data.pvDetails.reference_no }}<br />
                    <span class="font-weight-bold">Terms of: </span>
                    {{ data.pvDetails.reference_no }}<br />
                    <span class="font-weight-bold">Payment: </span>
                    {{ data.pvDetails.reference_no }}<br />
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="pt-3">
                    <span class="font-weight-bold">
                      Payment in respective of:
                    </span>
                    {{ data.pvDetails.description }}<br />
                    <span class="font-weight-bold">To be paid from: </span>
                    {{ data.pvDetails.reference_no }}<br />
                  </td>
                </tr>
              </table>
            </v-col>
            <v-col class="">
              <v-data-table
                    :headers="payablePrintHeader"
                    disable-pagination
                    hide-default-footer
                  >
                <template v-slot:body>
                  <tbody>
                    <tr v-for="(payable, i) in data.pvDetails.payables" :key="i">
                      <td>{{payable.gl_account}}</td>
                      <td>{{payable.funding_source.description}}</td>
                      <td>{{payable.description}}</td>
                      <td class="text-right">{{payable.amount | toCurrency()}}</td>
                    </tr>
                    <tr class="grey lighten-2">
                      <th colspan="3" class="text-right">NET AMOUNT</th>
                      <th class="text-right">{{data.pvDetails.amount | toCurrency()}}</th>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-col>
            <v-col>
              <table width="100%">
                <tbody>
                  <tr>
                    <td class="text-left text-h6">AUTHORITY:</td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      Certify that the above sum of shillings (in words)
                       <span class="font-weight-bold">
                         {{convert(data.pvDetails.amount * 1)}} only
                        </span> 
                       is correctly payable to the above-named person and that the rates of payment/price(s) is/are in accordance with Regulations/the Terms of the Contract and the funds are available under the Sub-Vote/Cost Centre and Item quoted above to meet this payment.
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-col>
            <v-col>
              <table width="100%">
                <tbody>
                  <tr>
                    <td class="text-left">Prepared By:</td>
                    <td class="text-left">Verified By:</td>
                    <td class="text-left">Approved By:</td>
                  </tr>
                  <tr>
                    <td class="text-left pt-10"><hr width="80%"></td>
                    <td class="text-left pt-10"><hr width="80%"></td>
                    <td class="text-left pt-10"><hr width="80%"></td>
                  </tr>
                  <tr>
                    <td class="text-left">Signature of Originating Officer</td>
                    <td class="text-left">Signature of Verifying Officer</td>
                    <td class="text-left">Signature of Authorizing Officer</td>
                  </tr>
                  <tr>
                    <td class="text-left pt-10">Date: ..............................</td>
                    <td class="text-left pt-10">Date: ..............................</td>
                    <td class="text-left pt-10">Date: ..............................</td>
                  </tr>
                </tbody>
              </table>
            </v-col>
            <v-col>
              <table width="100%">
                <tbody>
                  <tr>
                    <th class="text-left">Facility Financial Accounting and Reporting System</th>
                    <th class="text-right">Printed on: {{data.pvDetails.printDate | format("DD/MM/YYYY H:mm:ss")}}</th>
                  </tr>
                </tbody>
              </table>
            </v-col>
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
            @click="printPaymentVoucher(data.pvDetails.id)"
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
      payablePrintHeader,
      convert,
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
      payablePrintHeader,
      convert,
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
.login-logo {
  height: 170px;
  width: 130px;
}
.text-link{
  color: #1976d2 !important;
}
</style>
