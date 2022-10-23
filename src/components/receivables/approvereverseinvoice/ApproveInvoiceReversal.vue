<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>

      <v-btn
        class="ma-2 d-none d-sm-flex white--text"
        color="primary"
        router-link
        to="/manage-invoices"
        tag="button"
        ><v-icon>mdi-arrow-left-circle</v-icon>Back
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
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
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-text-field
                outlined
                label="Filter Invoice"
                @keyup="filterInvoice()"
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
            {{ item.description | capitalizeFirstLatter }}
          </span>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          {{ item.date | format() }}
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>
        <template v-slot:[`item.received_amount`]="{ item }">
          {{ item.received_amount | toCurrency() }}
        </template>
        <template v-slot:[`item.invoice_number`]="{ item }">
          <v-list-item id="p1" exact light @click="previewInvoice(item)"
            ><h3>
              {{ item.invoice_number }}
            </h3></v-list-item
          >
        </template>
        <template v-slot:[`item.pending`]="{ item }">
          {{ (item.amount - item.received_amount) | toCurrency() }}
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
    <Modal :modal="data.modal" :width="960">
      {{ data.formData }}
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Invoice`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row class="mt-n8 pa-5">
                <v-col cols="12" md="6">
                  <v-select
                    :items="data.customers"
                    prepend-inner-icon="mdi-account"
                    label="Select Customer"
                    outlined
                    v-model="data.formData.customer_id"
                    :item-text="'name'"
                    item-value="id"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }} -
                      <strong class="grey--text"
                        ><em
                          ><v-icon>mdi-phone</v-icon> {{ " " }}
                          {{ item.phone }}</em
                        >
                      </strong>
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            outlined
                            dense
                            placeholder="Search"
                            @input="searchCustomer"
                            hide-details=""
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col class="pt-6" cols="12" md="6">
                  <DatePicker
                    :label="'Invoice Date'"
                    :max="data.maxDate"
                    outlined
                    v-model="data.formData.date"
                  />
                </v-col>
                <v-col cols="12" md="12" class="mb-n8 mt-n4">
                  <v-textarea
                    v-model="data.formData.description"
                    :min-height="80"
                    :auto-grow="true"
                    outlined
                    label="Description"
                  >
                  </v-textarea>
                </v-col>
                <v-col class="pt-2" cols="12" md="12">
                  <tr class="heading blue-grey lighten-5">
                    <td colspan="3">
                      Add invoice item {{ " " }}{{ "by pressing" }}
                      <v-icon small color="success"> mdi-plus-circle </v-icon>
                      {{ " " }} {{ "or" }} {{ "remove by pressing " }}{{ " " }}
                      <v-icon small color="red"> mdi-minus-circle </v-icon
                      >{{ " " }}{{ "sign in the right" }}
                      {{ " " }}
                      <v-icon color=""> mdi-arrow-right-bold </v-icon>
                    </td>
                  </tr>
                </v-col>
                <v-col class="pt-2 invoice-table" cols="12" md="12">
                  <v-data-table
                    :headers="HEADERS"
                    :items="data.items"
                    disable-pagination
                    hide-default-footer
                  >
                    <template v-slot:body>
                      <tr
                        v-for="(invoice, index) in data.invoice_items"
                        :key="index"
                        class="invoice-tr"
                      >
                        <td>
                          <v-autocomplete
                            :items="data.itemdefinitions"
                            :item-text="'name'"
                            v-model="invoice.invoice_item_definition_id"
                            :name="`data.invoice_items[${index}][invoice_item_definition_id]`"
                            label="Select Invoice Item"
                            item-value="id"
                            dense
                            outlined
                            hide-details
                            clearable
                            @change="checkDublicate($event, index)"
                          ></v-autocomplete>
                        </td>

                        <td class="invoice-td">
                          <v-text-field
                            dense
                            hide-details
                            outlined
                            onkeydown="javascript: return event.keyCode == 69 ? false : true"
                            v-model="invoice.amount"
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
                              index || (!index && data.invoice_items.length > 1)
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
                            v-if="index == data.invoice_items.length - 1"
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
        <ModalHeader :title="`Cancel Invoice `" />
      </template>

      <template v-slot:body>
        <ModalBody> Are you sure you want to cancel this invoice? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelConfirmDialog"
            >No</v-btn
          >
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.approvemodal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`Approve Invoice Reversal `" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-col class="pt-6 pl-6 pr-6 red--text" cols="12" md="12">
            Press <strong>YES</strong> to confirm an approve of this invoice
            reversal?
          </v-col>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="approveInvoiceReversal"
            >Yes</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>

    <Modal :fullScreen="true" :modal="data.invoicedetails" :width="1120">
      <template v-slot:header>
        <ModalHeader :title="`Invoice Details`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="invoice-box" v-if="data.invoiceData">
            <td class="title">
              <v-btn color="red darken-1" text @click="cancelInvoiceDialog"
                ><v-icon>mdi-close</v-icon> Close</v-btn
              >

              <v-btn
                @click="approveInvoiceRevDialog(data.invoiceData.id)"
                color="primary"
                text
              >
                <v-icon>mdi-check-decagram</v-icon>
                APPROVE INVOICE REVERSE
              </v-btn>
            </td>
            <div class="invoice-box" v-if="data.invoiceData">
              <AppLocationHeader
                :facility="data.invoiceData.facility"
                :facility-type="data.invoiceData.faciliType"
                :location="data.invoiceData.location"
                :title="'Invoice'"
              />
              <v-divider class="underline-title"></v-divider>
            </div>
            <v-container class="">
              <v-row no-gutters>
                <v-col cols="12" sm="6" md="8">
                  <div class="text-xs-center">
                    <v-card flat class="pl-2"> </v-card>
                  </div>
                </v-col>
                <v-col cols="6" md="4">
                  <div class="text-xs-left">
                    <v-card flat align="right" class="pr-12" tile>
                      <strong>
                        Invoice #:{{
                          data.invoiceData
                            ? data.invoiceData.invoice_number
                            : ""
                        }}</strong
                      ><br />
                      <strong>
                        Created:
                        {{
                          data.invoiceData
                            ? data.invoiceData.date
                            : "" | format
                        }}<br />
                      </strong>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-sheet class="pl-3">
              <v-sheet class="information green lighten-5 text-capitalize">
                <strong> Description:</strong>
                <span class="">
                  {{ data.invoiceData.description | capitalizeFirstLatter }}
                </span>
              </v-sheet>
            </v-sheet>

            <v-data-table
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
            </v-data-table>
            <v-sheet class="text-capitalize pt-8">
              <strong> Prepared By:</strong>
              <em>
                {{
                  data.invoiceData.user ? data.invoiceData.user.first_name : ""
                }}
                {{ " " }}
                {{
                  data.invoiceData.user ? data.invoiceData.user.middle_name : ""
                }}
                {{ " " }}
                {{
                  data.invoiceData.user ? data.invoiceData.user.last_name : ""
                }}
              </em>
              {{ " ," }}
              <strong> Signature:</strong>
              <em> .............................. </em>
            </v-sheet>
          </div>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter> </ModalFooter>
      </template>
    </Modal>

    <Modal :fullScreen="true" :modal="data.invoicereceipt" :width="1120">
      <template v-slot:header>
        <ModalHeader :title="`Create Invoice Receipt`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <strong>
              <h3>Invoice #:{{ data.invoicereceip.invoice_number }}</h3>
            </strong>
          </v-card-actions>

          <v-form>
            <v-container>
              <v-row class="mt-n8 pa-5">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    readonly
                    v-model="data.invoicereceip.customer_id"
                    label="Select Customer"
                    :items="data.customer"
                    :item-text="'customer.name'"
                    item-value="customer.id"
                  ></v-autocomplete>
                </v-col>
                <v-col class="pt-6" cols="12" md="6">
                  <DatePicker
                    v-model="data.invoicereceip.date"
                    :label="'Receipt Date'"
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    hide-details="true"
                    v-model="data.invoicereceip.description"
                    label="Description"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="data.invoicereceip.bank_account_id"
                    label="Select Bank Account"
                    :items="bankName"
                    :item-text="`fullName`"
                    item-value="id"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details="true"
                    v-model="data.invoicereceip.bank_reference_number"
                    label="Bank Reference Number"
                  ></v-text-field>
                </v-col>

                <v-col class="pt-2" cols="12" md="12"> </v-col>
                <v-col class="pt-2 invoice-table" cols="12" md="12">
                  <v-data-table
                    :headers="RECEIPTHEADERS"
                    :items="data.items"
                    disable-pagination
                    hide-default-footer
                  >
                    <template v-slot:body>
                      <tr
                        v-for="(invoice, index) in newInvoiceItems"
                        :key="index"
                        class="invoice-tr"
                      >
                        <td>
                          <v-text-field
                            outlined
                            class="black--text"
                            dense
                            disabled
                            :filled="invoice.cleared"
                            hide-details
                            v-model="invoice.itemName"
                          ></v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field
                            outlined
                            dense
                            disabled
                            :filled="invoice.cleared"
                            hide-details
                            v-model="invoice.invoicedAmount"
                          ></v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field
                            outlined
                            dense
                            disabled
                            :filled="invoice.cleared"
                            hide-details
                            v-model="invoice.received"
                          ></v-text-field>
                        </td>
                        <td class="invoice-td">
                          <span v-if="invoice.cleared">
                            {{ "Cleared" }}
                            <v-icon color="green">mdi-check</v-icon>
                          </span>
                          <v-text-field
                            v-else
                            :filled="invoice.cleared"
                            outlined
                            dense
                            type="number"
                            onkeydown="javascript: return event.keyCode == 69 ? false : true"
                            hide-details
                            v-model="invoice.amount"
                            :name="`data.invoice_items[${index}][name]`"
                          ></v-text-field>
                        </td>
                      </tr>
                    </template>
                    <template v-slot:[`item.icon`]="{ item }">
                      <v-icon class="mr-2">{{ item.icon }}</v-icon>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions class="pr-4">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="cancelInvoiceReceipt"
                >Close</v-btn
              >
              <v-btn
                v-show="can('create', 'Receipt')"
                color="green darken-1"
                text
                @click="createReceipt"
              >
                Create</v-btn
              >
            </v-card-actions>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter> </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useInvoice } from "./composables/invoiceReversal";
import { toMoney } from "@/filters/CurrencyFormatter";
export default defineComponent({
  name: "ManageInvoice",
  setup() {
    const {
      data,
      getData,
      createReceipt,
      addRow,
      removeRow,
      openDialog,
      cancelDialog,
      reverseInvoice,
      getInvoiceItemdefinition,
      updateInvoiceItemDefinition,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      previewInvoice,
      cancelInvoiceDialog,
      cancelInvoiceReceipt,
      openInvoiceReceipt,
      HEADERS,
      RECEIPTHEADERS,
      bankName,
      HEADERS_INVOICE_DETAILS,
      newInvoiceItems,
      newInvoiceItem,
      sumDebts,
      checkDublicate,
      searchCustomer,
      reanderSearched,
      print,
      filterInvoice,
      resetSearchText,
      approveInvoiceRevDialog,
      approveInvoiceReversal,
    } = useInvoice();
    return {
      data,
      getData,
      createReceipt,
      addRow,
      removeRow,
      openDialog,
      cancelDialog,
      reverseInvoice,
      getInvoiceItemdefinition,
      updateInvoiceItemDefinition,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      previewInvoice,
      cancelInvoiceDialog,
      cancelInvoiceReceipt,
      openInvoiceReceipt,
      HEADERS,
      RECEIPTHEADERS,
      bankName,
      HEADERS_INVOICE_DETAILS,
      newInvoiceItems,
      newInvoiceItem,
      sumDebts,
      checkDublicate,
      searchCustomer,
      reanderSearched,
      print,
      toMoney,
      filterInvoice,
      resetSearchText,
      approveInvoiceRevDialog,
      approveInvoiceReversal,
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
</style>
<style>
/*remove arrow in number inputs*/
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
