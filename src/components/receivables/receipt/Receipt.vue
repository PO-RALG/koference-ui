<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        v-if="can('create', 'Receipt')"
        color="primary"
        @click="openDialog"
      >
        <v-icon>mdi-plus</v-icon>
        Create Receipt
      </v-btn>
      <!-- <v-btn
        class="ma-2 d-none d-sm-flex white--text"
        color="red"
        router-link
        to="/manage-approve-deposit-receipts"
        tag="button"
        ><v-icon>mdi-arrow-right-circle</v-icon>Approve deposit recept
      </v-btn>
      <v-btn
        class="ma-2 d-none d-sm-flex white--text"
        color="warning"
        router-link
        to="/manage-approve-reversal-receipts"
        tag="button"
        ><v-icon>mdi-arrow-right-circle</v-icon>Approve recept reversal
      </v-btn> -->
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="newreceiptItem"
        :single-expand="true"
        class="elevation-1"
        disable-pagination
        hide-default-footer
        :loading="data.loading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="3" class="pa-0">
              <v-text-field
                outlined
                label="Filter Receipt"
                @keyup="filterReceipt()"
                :items="data.itemsToFilter"
                v-model="data.searchTerm"
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.description`]="{ item }">
          <span>
            {{ item.newData.description }}
          </span>
        </template>

        <template v-slot:[`item.date`]="{ item }">
          {{ item.date | format("DD/MM/YYYY") }}
        </template>

        <template v-slot:[`item.totalAmt`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>
        <template v-slot:[`item.received_amount`]="{ item }">
          <span>
            {{ item.newData.items }}
          </span>
        </template>
        <template v-slot:[`item.bank_account`]="{ item }">
          <span>
            {{ item.bankAccount }}
          </span>
        </template>

        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>
        <template v-slot:[`item.pending`]="{ item }">
          {{ (item.amount - item.received_amount) | toCurrency() }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                v-show="can('delete', 'Receipt')"
                @click="reverseReceipt(item.id)"
                text
                color="grey"
              >
                <v-icon>mdi-arrow-u-left-top-bold</v-icon>
              </v-btn>
            </template>
            <span>Reverse</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="print(item.id)" text color="grey">
                <v-icon
                  v-if="can('delete', 'Receipt')"
                  v-bind="attrs"
                  v-on="on"
                  class="mr-2"
                >
                  mdi-printer
                </v-icon>
              </v-btn>
            </template>
            <span>Print</span>
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
    <Modal :modal="data.modal" :width="1250">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Receipt`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.receipt">
          <v-form>
            <v-container>
              <span>Select Receipt Type</span>
              <v-radio-group v-model="data.receiptType" row @change="resetData">
                <v-radio label="CASH" :value="cashType"></v-radio>
                <v-radio label="INVOICE" :value="invoiceType"></v-radio>
                <v-radio label="DEPOSIT" :value="depositType"></v-radio>
              </v-radio-group>
              <v-row>
                <!-- Start invoice -->
                <v-col cols="12" md="12" v-if="isInvoice" class="mb-n6">
                  <fetcher :api="'/api/v1/invoices'">
                    <div slot-scope="{ json: invoices, loading }">
                      <div v-if="loading">Loading...</div>
                      <v-autocomplete
                        v-else
                        v-model="data.receipt.invoice_id"
                        label="Select Invoice"
                        :items="mapInvoices(invoices)"
                        :item-text="'invoice_number'"
                        item-value="id"
                        @change="setCustomer($event)"
                        return-object
                        outlined
                        small
                      >
                      </v-autocomplete>
                    </div>
                  </fetcher>
                </v-col>

                <v-col
                  v-if="isInvoice && data.selectedInvoice"
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="data.selectedUser.name"
                    label="Invoice User"
                    readonly
                    small
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col
                  v-if="isInvoice && !data.selectedInvoice"
                  cols="12"
                  md="6"
                >
                  <v-text-field label="Invoice User" readonly small outlined>
                  </v-text-field>
                </v-col>
                <!-- end of invoice specific content -->
                <!-- start of cash and  deposit  -->
                <v-col v-if="!isInvoice" cols="12" md="6">
                  <v-autocomplete
                    v-model="data.receipt.customer_id"
                    label="Select Customer"
                    :items="data.customers"
                    :item-text="'name'"
                    item-value="id"
                    outlined
                    small
                  ></v-autocomplete>
                </v-col>
                <!-- end  of non invoice content -->

                <!-- common content starts here -->

                <v-col cols="12" md="6" class="mt-3 pr-6 pl-6">
                  <DatePicker
                    :label="'Receipt Date'"
                    :max="data.maxDate"
                    v-model="data.receipt.date"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="data.receipt.bank_account_id"
                    label="Select Bank Account"
                    :items="accounts"
                    :item-text="`fullName`"
                    item-value="id"
                    outlined
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Bank Reference Number"
                    outlined
                    v-model="data.receipt.bank_reference_number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea
                    label="Description"
                    outlined
                    v-model="data.receipt.description"
                  ></v-textarea>
                </v-col>
                <!-- Common content ends here -->
                <!-- invoice start -->

                <v-col
                  v-if="isInvoice && data.selectedInvoice"
                  class="pt-2 invoice-table"
                  cols="12"
                  md="12"
                >
                  <v-data-table
                    :headers="INVOICE_ITEM_HEADERS"
                    :items="data.selectedInvoice.invoice_items"
                    disable-pagination
                    hide-default-footer
                  >
                    <template v-slot:body>
                      <tr
                        v-for="(line, index) in data.selectedInvoice
                          .invoice_items"
                        :key="index"
                        class="invoice-tr"
                      >
                        <td class="invoice-td">
                          <v-select
                            :items="data.selectedInvoice.invoice_items"
                            :item-text="'definition.name'"
                            v-model="line.id"
                            :name="`data.receipt.items[${index}].amount`"
                            label="Select Invoice Item"
                            item-value="id"
                            disabled
                            dense
                            outlined
                            hide-details
                          ></v-select>
                        </td>

                        <td class="invoice-td">
                          <v-text-field
                            dense
                            hide-details
                            outlined
                            v-mask="toMoney"
                            v-model="line.amount"
                            disabled
                          >
                          </v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field
                            dense
                            hide-details
                            outlined
                            v-mask="toMoney"
                            disabled
                            v-model="line.received_amount"
                          >
                          </v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field
                            dense
                            hide-details
                            outlined
                            v-mask="toMoney"
                            v-model="line.pay_amount"
                          >
                          </v-text-field>
                        </td>
                      </tr>
                    </template>
                    <template v-slot:[`item.icon`]="{ item }">
                      <v-icon class="mr-2">{{ item.icon }}</v-icon>
                    </template>
                  </v-data-table>
                </v-col>
                <!-- end of invoice -->

                <!-- start of cash -->

                <!-- cash start -->
                <v-container v-if="isCash">
                  <v-col class="pt-0" cols="12" md="12">
                    <tr class="heading blue-grey lighten-5">
                      <td colspan="3">
                        Add GLAccount {{ " " }}{{ "by pressing" }}
                        <v-icon small color="success"> mdi-plus-circle</v-icon>
                        {{ " " }} {{ "or" }} {{ "remove by pressing "
                        }}{{ " " }}
                        <v-icon small color="red"> mdi-minus-circle </v-icon>
                        {{ " " }}{{ "sign in the right" }}
                        {{ " " }}
                        <v-icon color=""> mdi-arrow-right-bold</v-icon>
                      </td>
                    </tr>
                  </v-col>

                  <v-col
                    v-if="isCash"
                    class="pt-0 invoice-table"
                    cols="12"
                    md="12"
                  >
                    <v-data-table
                      :headers="HEADERS"
                      :items="data.items"
                      disable-pagination
                      hide-default-footer
                    >
                      <template v-slot:body>
                        <tr
                          v-for="(line, index) in data.receipt.items"
                          :key="index"
                          class="invoice-tr"
                        >
                          <td>
                            <v-select
                              :items="data.fundingSources"
                              :item-text="'description'"
                              v-model="line.funding_source_code"
                              :name="`data.receipt.items[${index}]`"
                              label="Select Fund Source"
                              item-value="code"
                              full-width
                              dense
                              outlined
                              item-disabled="disabled"
                              @change="loadGLAccounts($event, index)"
                              hide-details
                            >
                              <template v-slot:selection="{ item }">
                                {{ item.description }} {{ "-" }} {{ item.code }}
                              </template>
                              <template v-slot:item="{ item }">
                                {{ item.description }} {{ "-" }} {{ item.code }}
                              </template>
                              <template v-slot:prepend-item>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-text-field
                                      clearable
                                      outlined
                                      dense
                                      label="Search Fund Source"
                                      v-model="data.searchTerm"
                                      @input="filterFundSource"
                                    ></v-text-field>
                                  </v-list-item-content>
                                </v-list-item>
                                <v-divider></v-divider>
                              </template>
                            </v-select>
                          </td>
                          <td>
                            <v-select
                              :items="data.gl_accounts[index]"
                              :item-text="'displayName'"
                              v-model="line.gl_account_id"
                              :name="`data.receipt.items[${index}][gl_account_id]`"
                              label="Select GL Account"
                              item-value="id"
                              full-width
                              dense
                              outlined
                              item-disabled="disabled"
                              hide-details
                            >
                            </v-select>
                          </td>

                          <td class="invoice-td">
                            <v-text-field
                              dense
                              hide-details
                              outlined
                              onkeydown="javascript: return event.keyCode == 69 ? false : true"
                              v-model="line.amount"
                              v-mask="toMoney"
                              :name="`data.invoice_items[${index}][name]`"
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-btn
                              color="blue darken-1"
                              small
                              text
                              v-if="
                                index ||
                                (!index && data.receipt.items.length > 1)
                              "
                              @click="removeRow(index)"
                            >
                              <v-icon small color="red">
                                mdi-minus-circle
                              </v-icon>
                            </v-btn>
                            <v-btn
                              small
                              color="blue darken-1"
                              text
                              @click="addRow"
                              v-if="index == data.receipt.items.length - 1"
                            >
                              <v-icon small color="success">
                                mdi-plus-circle
                              </v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </template>
                      <template v-slot:[`item.icon`]="{ item }">
                        <v-icon class="mr-2">{{ item.icon }}</v-icon>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-container>
                <!-- end of cash -->
                <!-- deposit start  --->
                <v-container v-if="isDeposit">
                  <v-row
                    v-for="(item, index) in data.receipt.items"
                    :key="item.id"
                  >
                    <v-col cols="9" md="9" class="d-flex">
                      <v-select
                        v-model="data.receipt.items[index].gl_account_id"
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
                        label="Amount"
                        v-model="data.receipt.items[index].amount"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <!-- deposity end -->
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="save"
            >{{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="400">
      <template v-slot:header>
        <ModalHeader :title="`Cancel Receipt `" />
      </template>

      <template v-slot:body>
        <ModalBody> Are you sure you want to reverce this receipt ?</ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelConfirmDialog"
            >No
          </v-btn>
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useReceipt } from "./composables/receipt";
import { toMoney } from "@/filters/CurrencyFormatter";

export default defineComponent({
  name: "ManageReceipt",
  setup() {
    const {
      data,
      getData,
      createReceipt,
      addRow,
      removeRow,
      openDialog,
      cancelDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchCategory,
      previewInvoice,
      accounts,
      newreceiptItem,
      print,
      HEADERS,
      loadGLAccounts,
      isInvoice,
      isCash,
      isDeposit,
      setCustomer,
      resetData,
      INVOICE_ITEM_HEADERS,
      reanderSearched,
      mapInvoices,
      filterFundSource,
      reverseReceipt,
      filterReceipt,
      resetSearchText,
      invoiceType,
      cashType,
      depositType,
    } = useReceipt();

    return {
      data,
      getData,
      createReceipt,
      addRow,
      removeRow,
      openDialog,
      cancelDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchCategory,
      previewInvoice,
      accounts,
      newreceiptItem,
      print,
      HEADERS,
      loadGLAccounts,
      isInvoice,
      isCash,
      isDeposit,
      setCustomer,
      resetData,
      INVOICE_ITEM_HEADERS,
      reanderSearched,
      toMoney,
      mapInvoices,
      filterFundSource,
      resetSearchText,
      reverseReceipt,
      filterReceipt,
      invoiceType,
      cashType,
      depositType,
    };
  },
});
</script>

<style lang="scss">
#p1 {
  text-decoration: underline;
  text-decoration-color: rgba(0, 110, 255, 0.76);
  text-decoration-thickness: 2px;
}

.underline-amount {
  border-style: double none double;
}

.underline-invoice-number {
  border-style: none none double;
  border-block-color: rgba(0, 110, 255, 0.76);
}

.invoice-box {
  max-width: 1100;
  margin: auto;
  padding: 2px;
  /* border: 1px solid #eee; */
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); */
  line-height: 24px;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(n + 2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.item input {
  padding-left: 5px;
}

.invoice-box table tr.item td:first-child input {
  margin-left: -5px;
  width: 100%;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
}

.invoice-box input[type="number"] {
  width: 60px;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }
  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}

/** RTL **/
.rtl table {
  text-align: right;
}

.rtl table tr td:nth-child(2) {
  text-align: left;
}

.login-logo {
  height: 160px;
  width: 130px;
}

tbody tr:nth-of-type(odd) {
  background-color: none;
}

.invoice-table {
  table {
    border: 1px solid #cccc;

    tr.invoice-tr {
      border-right: 1px solid #ccc;
    }

    th {
      border-right: 1px solid #ccc;

      &:last-child {
        border-right: none;
      }
    }

    td {
      border-right: 1px solid #ccc;
      padding: 5px;

      &:last-child {
        border-right: none;
      }
    }
  }

  .v-card__actions {
    margin-right: 15px;
  }
}

/*remove arrow in number inputs*/
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
