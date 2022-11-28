<template>
  <div class="Payment">
    <v-card-actions class="pa-4">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        hide-default-footer
        class="elevation-1 pa-2"
        disable-pagination
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-text-field
                prepend-inner-icon="mdi-filter-outline"
                outlined
                label="Enter Last Three (3) Payment or PV Number"
                @keyup="filterPayment()"
                :items="data.itemsToFilter"
                v-model="data.searchTerm"
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.payment_date`]="{ item }">
          <span>{{ item.payment_date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.bank_account`]="{ item }">
          <span>
            {{ item.bank_account?.number }}({{ item.bank_account?.name }})
          </span>
        </template>
        <template v-slot:[`item.voucher`]="{ item }">
          <span>
            <v-list-item
              class="text-link"
              exact
              light
              @click="previewPayment(item.id)"
            >
              {{ item.voucher?.reference_no }}
            </v-list-item>
          </span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>

        <template v-slot:[`item.approve`]="{ item }">
          <span v-if="item.isApprovedFacility">{{
            "Waiting for Reversal Approval from Council"
          }}</span>
          <span
            v-if="!item.isApprovedFacility && item.isRequestedToReverse[0]"
            >{{ "Waiting for Reversal Approval from Admin" }}</span
          >
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="openRequestReversalDialog(item.id)"
                v-if="
                  !item.isApprovedFacility &&
                  item.isRequestedToReverse == false &&
                  can('delete', 'Voucher')
                "
              >
                mdi-book-arrow-left-outline
              </v-icon>
            </template>
            <span>Send Reverse Request</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="red"
                v-if="
                  canApproveCouncil(
                    item,
                    'REVERSAL_OF_PAYMENT',
                    'reverseApprovalCouncil',
                    'Payment'
                  )
                "
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="approveReversalPCouncil(item)"
              >
                mdi-check-decagram
              </v-icon>
            </template>
            <span>Approve reversal</span>
          </v-tooltip>

          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="red"
                v-if="
                  canApproveCouncil(
                    item,
                    'REVERSAL_OF_PAYMENT',
                    'reverseApprovalCouncil',
                    'Payment'
                  )
                "
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="rejectReversalPCouncil(item)"
              >
                mdi-cancel
              </v-icon>
            </template>
            <span>Reject</span>
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

    <Modal :modal="data.modal" :width="1000">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Payment`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row class="pa-2">
                <v-col cols="12" :md="data.showDate ? '6' : '12'" sm="12">
                  <v-select
                    v-model="data.formData.voucher_id"
                    :items="newVouchers"
                    item-text="reference_no"
                    item-value="id"
                    label="Select PV"
                    @change="setPayableItems($event)"
                    return-object
                    outlined
                    small
                  >
                  </v-select>
                </v-col>
                <v-col
                  class="pt-6 pl-6 pr-6"
                  cols="12"
                  md="6"
                  v-if="data.showDate"
                >
                  <DatePicker
                    :label="'Date'"
                    v-model="data.formData.payment_date"
                    :max="data.maxDate"
                    :min="data.minDate"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6" sm="12" class="mt-n8">
                  <v-select
                    v-model="data.formData.bank_account_id"
                    :items="data.bankAccounts"
                    item-text="name"
                    item-value="id"
                    label="Select Bank Account"
                    outlined
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="6" sm="12" class="mt-n8">
                  <v-select
                    v-model="data.formData.cheque_type"
                    :items="data.chequeTypes"
                    label="Select Cheque Type"
                    required
                    outlined
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="6" sm="12" class="mt-n8">
                  <v-text-field
                    v-model="data.formData.cheque"
                    label="Cheque"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="12" class="mt-n8">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <template>
                <v-col
                  cols="12"
                  md="12"
                  class="data-table"
                  v-if="data.formData.voucher_id"
                >
                  <!-- <pre>{{ data.payableItems }}</pre> -->
                  <v-data-table
                    :headers="payableHeader"
                    disable-pagination
                    hide-default-footer
                    v-if="data.payableItems.length > 0"
                  >
                    <template v-slot:body>
                      <tbody>
                        <tr v-for="(payable, i) in data.payableItems" :key="i">
                          <td>
                            {{ payable.description }}<br />
                            <span class="teal--text">
                              {{ payable.funding_source.description }}
                              ({{ payable.funding_source.code }})
                            </span>
                          </td>
                          <td>
                            {{ payable.required_amount | toCurrency() }}
                          </td>
                          <td>
                            {{ payable.paid_amount | toCurrency() }}
                          </td>
                          <td>
                            {{ payable.payment | toCurrency() }}
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

    <Modal :modal="data.deletemodal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`Reverse Payment `" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form v-model="data.valid">
            <v-col class="pt-6 pl-6 pr-6" cols="12" md="12">
              <DatePicker
                :label="'Cancellation Date'"
                v-model="data.reverseForm.date"
                :max="data.maxDate"
                :min="data.minDate"
                required
              />
            </v-col>
            <v-col class="pt-0 pl-6 pr-6 red--text" cols="12" md="12">
              Are you sure you want to reverse this payment?
            </v-col>
          </v-form>
        </ModalBody>
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

    <Modal :fullScreen="true" :modal="data.paymentModal" :width="1260">
      <template v-slot:header>
        <ModalHeader :title="`Payment Voucher`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cancelPreviewDialog">
              Cancel
            </v-btn>
            <v-btn
              v-if="can('create', 'Payment')"
              color="green darken-1"
              text
              @click="printPayment(data.pvDetails.id)"
            >
              Print
            </v-btn>
          </v-card-actions>
          <div class="" v-if="data.pvDetails">
            <v-col class="d-flex justify-center">
              <div class="font-weight-bold text-center">
                <img :src="data.coat" class="login-logo pt-5" /><br />
                The United Republic of Tanzania <br />
                President's Office<br />
                Regional Administration and Local Government
                <br />
                {{ data.pvDetails.council ? data.pvDetails.council.name : "" }}
                <br />
                {{
                  data.pvDetails.facility ? data.pvDetails.facility.name : ""
                }}
                {{
                  data.pvDetails.facility
                    ? data.pvDetails.facility.facility_type.name
                    : ""
                }}<br />
              </div>
            </v-col>
            <v-col class="d-flex justify-center">
              <div class="text-subtitle-1 font-weight-bold">PAYMENT</div>
            </v-col>
            <v-col>
              <table width="100%">
                <tr>
                  <td class="pb-5">
                    <span>STATION #: ............</span><br />
                  </td>
                  <td class="text-right pb-7">
                    <table class="float-right">
                      <tr>
                        <td>
                          <span>PV #: </span><br />
                          <span>Payment #: </span>
                        </td>
                        <td>
                          <span class="font-weight-bold">
                            {{ data.pvDetails.voucher_number }} </span
                          ><br />
                          <span class="font-weight-bold">
                            {{ data.pvDetails.reference_no }}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="text-left">
                    <table class="table">
                      <tr>
                        <td>
                          <span class="font-weight-bold">Payee's name: </span>
                          <br />
                          <span class="font-weight-bold">Mobile #: </span>
                          <br />
                          <span class="font-weight-bold">Address: </span>
                          <br />
                          <span class="font-weight-bold">TIN: </span>
                          <br /><br />
                        </td>
                        <td>
                          {{ data.supplier.name }}<br />
                          {{ data.supplier.phone }}<br />
                          {{ data.supplier.address }}<br />
                          {{ data.supplier.tin }}<br /><br />
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="text-right">
                    <table class="table float-right">
                      <tr>
                        <td>
                          <span class="font-weight-bold">Apply date: </span>
                          <br />
                          <span class="font-weight-bold">Reference No: </span>
                          <br />
                          <span class="font-weight-bold">SBC: </span>
                          <br />
                          <span class="font-weight-bold">Terms of: </span>
                          <br />
                          <span class="font-weight-bold">Payment: </span>
                          <br />
                        </td>
                        <td>
                          {{ data.pvDetails.payment_date | format("DD/MM/YYYY")
                          }}<br />
                          {{ data.pvDetails.cheque }}<br />
                          {{ ` - ` }}<br />
                          {{ ` ASAP` }}<br />
                          <span v-if="data.pvDetails.cheque">{{
                            data.pvDetails.cheque.length > 0
                              ? `CHEQUE`
                              : ` MANUAL `
                          }}</span
                          ><br />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="pt-3">
                    <span class="font-weight-bold">
                      Payment in respective of:
                    </span>
                    {{ data.pvDetails.description }}<br />
                    <span class="font-weight-bold">To be paid from: </span>
                    {{
                      data.pvDetails.bank_account
                        ? data.pvDetails.bank_account.bank +
                          ", " +
                          data.pvDetails.bank_account.branch +
                          ", " +
                          data.pvDetails.bank_account?.number
                        : ""
                    }}<br />
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
                    <tr
                      v-for="(payable, i) in data.pvDetails.payment_items"
                      :key="i"
                    >
                      <td>{{ payable.gl_account.code }}</td>
                      <td>
                        {{
                          payable.gl_account.fund_source
                            ? payable.gl_account.fund_source.description
                            : ""
                        }}
                      </td>
                      <td>{{ payable.gl_account.description }}</td>
                      <td class="text-right">
                        {{ payable.amount | toCurrency() }}
                      </td>
                    </tr>
                    <tr class="grey lighten-2">
                      <th colspan="3" class="text-right">NET AMOUNT</th>
                      <th class="text-right">
                        {{ data.pvDetails.amount | toCurrency() }}
                      </th>
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
                        {{ data.pvDetails.amount_in_words }} only
                      </span>
                      is correctly payable to the above-named person and that
                      the rates of payment/price(s) is/are in accordance without
                      Regulations/the Terms of the Contract and the funds are
                      available under the Sub-Vote/Cost Centre and Item quoted
                      above to meet this payment.
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-col>
            <v-col>
              <table width="100%">
                <tbody>
                  <tr>
                    <td class="text-left">
                      Prepared By:
                      <span class="text-uppercase">
                        {{
                          data.pvDetails.user
                            ? data.pvDetails.user.first_name
                            : ""
                        }}
                        {{
                          data.pvDetails.user
                            ? data.pvDetails.user.middle_name
                            : ""
                        }}
                        {{
                          data.pvDetails.user
                            ? data.pvDetails.user.last_name
                            : ""
                        }}
                      </span>
                    </td>
                    <td class="text-left">Approved By:</td>
                    <td class="text-left">Authorized By:</td>
                  </tr>
                  <tr>
                    <td class="text-left pt-10"><hr width="80%" /></td>
                    <td class="text-left pt-10"><hr width="80%" /></td>
                    <td class="text-left pt-10"><hr width="80%" /></td>
                  </tr>
                  <tr>
                    <td class="text-left">Signature</td>
                    <td class="text-left">Signature</td>
                    <td class="text-left">Signature</td>
                  </tr>
                  <tr>
                    <td class="text-left pt-10">
                      Date: ..............................
                    </td>
                    <td class="text-left pt-10">
                      Date: ..............................
                    </td>
                    <td class="text-left pt-10">
                      Date: ..............................
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-col>
            <v-col>
              <table width="100%">
                <tbody>
                  <tr>
                    <th class="text-left">
                      Facility Financial Accounting and Reporting System
                    </th>
                    <th class="text-right">
                      Printed on:
                      {{ data.pvDetails.printDate }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </div>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <!-- <v-btn color="red darken-1" text @click="cancelPreviewDialog">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="printPayment(data.pvDetails.id)"
          >
            Print
          </v-btn> -->
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="data.genericrejectConfirmModel" :width="600">
      <template v-slot:header>
        <ModalHeader :title="data.modalTitle" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  {{ data.modalTitle }}
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="data.formDataReceiptRejectionComment"
                    label="Rejection Comment"
                    outlined
                    required
                    :rules="data.validate.rejectionReason"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container> </v-form
        ></ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelGenericConfirmDialog">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            :disabled="!data.valid"
            text
            @click="data.genericDialogAction"
            >Yes</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="data.genericDeleteConfirmModel" :width="600">
      <template v-slot:header>
        <ModalHeader :title="data.modalTitle" />
      </template>
      <template v-slot:body>
        <ModalBody> {{ data.modalTitle }}</ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelGenericConfirmDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="data.genericDialogAction"
            >Yes</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePayment } from "./composables/payment-council-approval";

export default defineComponent({
  name: "PaymentCouncilApproval",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openRequestReversalDialog,
      save,
      remove,
      approvePaymet,
      cancelConfirmDialog,
      searchItem,
      getData,
      setPayableItems,
      maxRules,
      payableHeader,
      openHistoryDialog,
      previewPayment,
      cancelPreviewDialog,
      printPayment,
      payablePrintHeader,
      filterPayment,
      resetSearchText,
      mappedVouchers,
      newVouchers,
      approveReversalPFacility,
      cancelGenericConfirmDialog,
      approveReversalPCouncil,
      rejectReversalPCouncil,
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
      setPayableItems,
      maxRules,
      payableHeader,
      openHistoryDialog,
      previewPayment,
      cancelPreviewDialog,
      printPayment,
      payablePrintHeader,
      filterPayment,
      resetSearchText,
      mappedVouchers,
      approvePaymet,
      newVouchers,
      approveReversalPFacility,
      cancelGenericConfirmDialog,
      approveReversalPCouncil,
      rejectReversalPCouncil,
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
.text-link {
  color: #1976d2 !important;
}
</style>
