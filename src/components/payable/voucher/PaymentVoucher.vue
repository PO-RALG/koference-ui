<template>
  <div class="Payment Voucher">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'Voucher')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
      <v-btn
        class="ma-2 d-none d-sm-flex white--text"
        color="red"
        router-link
        to="/payment-vouchers-approval"
        tag="button"
        ><v-icon>mdi-arrow-right-circle</v-icon>Approve Payment Vouchers
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
              <v-text-field
                prepend-inner-icon="mdi-filter-outline"
                outlined
                label="Enter Last Three (3) PV Number"
                @keyup="filterVoucher()"
                :items="data.itemsToFilter"
                v-model="data.searchTerm"
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.reference_no`]="{ item }">
          <span>
            <v-list-item
              class="text-link"
              exact
              light
              @click="previewPaymentVoucher(item.id)"
            >
              {{ item.reference_no }}
            </v-list-item>
          </span>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>
        <template v-slot:[`item.amount_paid`]="{ item }">
          {{ item.amount_paid | toCurrency() }}
        </template>
        <template v-slot:[`item.full_paid`]="{ item }">
          <span class="" v-if="fullPaid(item)">
            <!-- <v-icon medium color="success">mdi-check</v-icon> -->
            Paid
          </span>
          <span class="" v-else>
            <!-- <v-icon medium color="warning">mdi-close</v-icon> -->
            Not Paid
          </span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="openConfirmDialog(item.id)"
                :disabled="cant('delete', 'Voucher')"
              >
                mdi-arrow-u-left-top-bold
              </v-icon>
            </template>
            <span>Reverse Payment Voucher</span>
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
    <Modal :modal="data.modal" :width="1200">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Payment Voucher`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <span>Select Receipt Type</span>
            <v-radio-group v-model="data.voucherType" row @change="resetData">
              <v-radio label="NORMAL VOUCHER" :value="normalType"></v-radio>
              <v-radio label="DEPOSIT VOUCHER" :value="depositType"></v-radio>
            </v-radio-group>
            <v-container>
              <v-row class="pt-5 pl-5 pr-5">
                <v-col cols="12" md="6" sm="12">
                  <DatePicker
                    :label="'Date'"
                    v-model="data.formData.date"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6" class="mt-n3">
                  <v-select
                    v-model="data.formData.supplier_id"
                    :items="data.suppliers"
                    item-value="id"
                    item-text="name"
                    label="Select Payee"
                    outlined
                    required
                  >
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            v-model="data.searchTerm"
                            placeholder="Search"
                            @input="searchSuppliers"
                            outlined
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row class="pl-3 pr-5 pb-n4">
                <v-col cols="12" md="12" sm="12" class="mt-n8">
                  <v-textarea
                    v-model="data.formData.description"
                    :min-height="40"
                    :auto-grow="true"
                    outlined
                    label="Description"
                  >
                  </v-textarea>
                </v-col>
              </v-row>

              <!-- for normal voucher --->
              <v-container v-if="isNormal">
                <v-row class="pl-3 pr-5 mt-n8">
                  <v-col md="4" sm="12" cols="12">
                    <v-select
                      :items="data.fundingSources"
                      item-text="code"
                      label="Select Funding Sources"
                      @change="getActivities($event)"
                      outlined
                      return-object
                    >
                      <template v-slot:selection="{ item }">
                        {{ item.code }} - {{ item.description }}
                      </template>
                      <template v-slot:item="{ item }">
                        {{ item.code }} - {{ item.description }}
                      </template>
                      <template v-slot:prepend-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-text-field
                              v-model="data.searchTerm"
                              placeholder="Search"
                              outlined
                              @input="searchFundSource"
                            ></v-text-field>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col md="4" sm="12" cols="12">
                    <v-select
                      :items="activities"
                      item-text="name"
                      label="Select Activity"
                      @change="searchGfsCodes($event)"
                      outlined
                      required
                      v-model="data.selectedActivity"
                    >
                      <template v-slot:selection="{ item }">
                        {{ item.code }} - {{ item.description }}
                      </template>
                      <template v-slot:item="{ item }">
                        {{ item.code }} - {{ item.description }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col md="4" sm="12" cols="12">
                    <v-select
                      :items="data.gfsCodes"
                      item-value="code"
                      item-text="name"
                      label="Select GFS Code"
                      outlined
                      @change="filterGfsCodes($event)"
                      v-model="data.selectedGfsCodes"
                    >
                      <template v-slot:selection="{ item }">
                        {{ item.code }} - {{ item.name }}
                      </template>
                      <template v-slot:item="{ item }">
                        {{ item.code }} - {{ item.name }}
                      </template>
                    </v-select>
                  </v-col>
                  <span
                    v-if="data.accounts.length && data.selectedGfsCodes"
                    class="primary--text lighten-5 pl-3 pa-5"
                  >
                    Click/Select GL to allocate Funds
                    <v-icon small color="success"> mdi-arrow-down-bold </v-icon>
                  </span>
                </v-row>

                <template>
                  <v-simple-table v-if="data.selectedGfsCodes">
                    <template v-slot:default>
                      <tbody>
                        <tr v-for="(account, i) in data.accounts" :key="i">
                          <td
                            class="py-2"
                            @click="addPayable(account)"
                            colspan="2"
                          >
                            <span>{{ account.code }}</span>
                            <br />
                            <span style="color: teal">
                              {{ account.description }}
                            </span>
                            <br />
                            <span>
                              {{
                                (account.allocation - account.totalExpenditure)
                                  | toCurrency()
                              }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>

                  <v-col
                    cols="12"
                    md="12"
                    class="pb-3 pt-7 data-table"
                    v-if="data.payables.length"
                  >
                    <v-data-table
                      :headers="payableHeader"
                      disable-pagination
                      hide-default-footer
                    >
                      <template v-slot:body>
                        <tbody>
                          <tr v-for="(item, i) in data.payables" :key="i">
                            <td class="pt-5 pb-2">
                              <span class="text-lg-body-1">{{
                                item.code
                              }}</span>
                              <br />
                              <span style="color: teal">{{
                                item.description
                              }}</span>
                              <br />
                              <span class="text--primary">{{
                                item.balance
                              }}</span>
                            </td>
                            <td class="pt-5 pb-2">
                              <v-text-field
                                dense
                                outlined
                                v-mask="toMoney"
                                v-model="item.amount"
                                persistent-hint
                                :hint="'Available balance: ' + item.balance"
                              >
                                <!-- :rules="[maxRules(item.balance)]" -->
                              </v-text-field>
                            </td>
                            <td>
                              <v-btn text @click="removePayable(i)">
                                <v-icon color="red darken-1"
                                  >mdi-minus-circle</v-icon
                                >
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-data-table>
                  </v-col>
                </template>
              </v-container>
              <!-- end of section specific for normal voucher  -->
              <!-- start of deposit voucher -->
              <!-- deposit start  --->
              <v-container v-if="isDeposit">
                <v-row v-for="(item, index) in data.payables" :key="item.id">
                  <v-col cols="9" md="9" class="d-flex">
                    <v-select
                      v-model="data.payables[index].id"
                      :items="data.depositAccounts"
                      item-value="id"
                      name="description"
                      item-text="description"
                      label="Select account"
                      outlined
                      required
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="3" md="3">
                    <v-text-field
                      outlined
                      v-mask="toMoney"
                      v-model="data.payables[index].amount"
                      label="Amount"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <!-- deposity end -->
              <!-- end of details for deposit voucher -->
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
        <ModalHeader :title="`Reverse Payment Voucher `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure you want to reverse? </ModalBody>
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
        <ModalHeader :title="`Voucher`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="" v-if="data.pvDetails">
            <v-col class="d-flex justify-center">
              <div class="font-weight-bold text-center">
                <img :src="data.coat" class="login-logo pt-5" /><br />
                The United Republic of Tanzania <br />
                President's Office <br />
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
                }}
                <br />
              </div>
            </v-col>
            <v-col class="d-flex justify-center">
              <div class="text-subtitle-1 font-weight-bold">
                PAYMENT VOUCHER
              </div>
            </v-col>
            <v-col>
              <table width="100%">
                <tbody>
                  <tr>
                    <td class="text-left">
                      <table>
                        <tr>
                          <td>
                            <span class="font-weight-bold">Payee's name: </span>
                            <br />
                            <span class="font-weight-bold">Mobile #: </span>
                            <br />
                            <span class="font-weight-bold">Address: </span>
                            <br />
                            <span class="font-weight-bold">TIN: </span>
                            <br />
                          </td>
                          <td>
                            {{
                              data.pvDetails.supplier
                                ? data.pvDetails.supplier.name
                                : ""
                            }}<br />
                            {{
                              data.pvDetails.supplier
                                ? data.pvDetails.supplier.phone
                                : ""
                            }}<br />
                            {{
                              data.pvDetails.supplier
                                ? data.pvDetails.supplier.address
                                : ""
                            }}<br />
                            {{
                              data.pvDetails.supplier
                                ? data.pvDetails.supplier.tin
                                : ""
                            }}<br />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <!-- <td class="text-right">
                      <table class="float-right">
                        <tr>
                          <td>
                            <span>REF #: </span><br />
                            <span>Date:</span><br />
                            <span>REF #: </span><br /><br /><br />
                          </td>
                          <td>
                            <span class="font-weight-bold">
                              {{ data.pvDetails.reference_no }} </span
                            ><br />
                            <span class="font-weight-bold">
                              {{
                                data.pvDetails.date | format("DD/MM/YYYY")
                              }}</span
                            >
                            <br /><br /><br />
                          </td>
                      </table>
                    </td> -->
                    <td class="text-right pt-2">
                      <table class="float-right">
                        <td class="text-left">
                          <span>REF #: </span><br />
                          <span>Date : </span><br />
                          <span>Cheque #:</span><br /><br /><br />
                        </td>
                        <td>
                          <span class="font-weight-bold">
                            {{ data.pvDetails.reference_no }} </span
                          ><br />
                          <span class="font-weight-bold">
                            {{
                              data.pvDetails.date | format("DD/MM/YYYY")
                            }}</span
                          >
                          <br /><br /><br />
                        </td>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="pt-3">
                      <span class="font-weight-bold">Description:</span>
                      {{ data.pvDetails.description }}<br />
                    </td>
                  </tr>
                </tbody>
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
                      v-for="(payable, i) in data.pvDetails.payables"
                      :key="i"
                    >
                      <td>{{ payable.gl_account }}</td>
                      <td>{{ payable.funding_source.description }}</td>
                      <td>{{ payable.description }}</td>
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
            <v-col class="pt-10">
              <table width="100%">
                <tbody>
                  <tr>
                    <th class="text-left">
                      Facility Financial Accounting and Reporting System
                    </th>
                    <th class="text-right">
                      Printed on: {{ data.pvDetails.printDate }}
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
import { usePaymentVoucher } from "./composables/payment-voucher";
import { toMoney } from "@/filters/CurrencyFormatter";

export default defineComponent({
  name: "PaymentVoucher",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      searchSuppliers,
      addPayable,
      removePayable,
      filterActivities,
      searchGfsCodes,
      searchFundingSource,
      filterGfsCodes,
      maxRules,
      resetBudget,
      payableHeader,
      payablePrintHeader,
      previewPaymentVoucher,
      printPaymentVoucher,
      cancelPreviewDialog,
      fullPaid,
      filterVoucher,
      resetSearchText,
      getActivities,
      activities,
      searchFundSource,
      loadBudget,
      isNormal,
      isDeposit,
      depositType,
      normalType,
      resetData,
    } = usePaymentVoucher();

    return {
      toMoney,
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      searchSuppliers,
      addPayable,
      removePayable,
      filterActivities,
      searchGfsCodes,
      searchFundingSource,
      filterGfsCodes,
      maxRules,
      resetBudget,
      payableHeader,
      payablePrintHeader,
      previewPaymentVoucher,
      printPaymentVoucher,
      cancelPreviewDialog,
      fullPaid,
      filterVoucher,
      resetSearchText,
      getActivities,
      activities,
      searchFundSource,
      loadBudget,
      isNormal,
      isDeposit,
      depositType,
      normalType,
      resetData,
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
.text-link {
  color: #1976d2 !important;
}
</style>
