<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="cant('create', 'Invoice')"
        color="primary"
        @click="openDialog"
      >
        <v-icon>mdi-plus</v-icon>
        Create Invoice
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
              <v-autocomplete
                label="Filter By Invoice Number"
                @change="searchCategory($event)"
                :items="data.itemsToFilter"
                :item-text="'invoice_number'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
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
    <Modal :modal="data.modal" :width="1000">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Invoice`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row class="mt-n8 pa-5">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="data.formData.customer_id"
                    label="Select Customer"
                    :items="data.customers"
                    :item-text="'name'"
                    item-value="id"
                    small
                  ></v-autocomplete>
                </v-col>
                <v-col class="pt-6" cols="12" md="6">
                  <DatePicker
                    :label="'Ivoice Date'"
                    v-model="data.formData.date"
                  />
                </v-col>
                <v-col cols="12" md="12" class="mt-n8">
                  <v-text-field
                    label="Description"
                    v-model="data.formData.description"
                  ></v-text-field>
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
                          <v-select
                            :items="data.itemdefinitions"
                            :item-text="'name'"
                            v-model="invoice.invoice_item_definition_id"
                            :name="`data.invoice_items[${index}][invoice_item_definition_id]`"
                            label="Select Ivoice Item"
                            item-value="id"
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
                            type="number"
                            onkeydown="javascript: return event.keyCode == 69 ? false : true"
                            v-model="invoice.amount"
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

    <Modal :fullScreen="true" :modal="data.invoicedetails" :width="1120">
      <template v-slot:header>
        <ModalHeader :title="`Invoice Details`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="invoice-box" v-if="data.invoicedata">
            <td class="title">
              <v-btn
                v-show="can('create', 'Receipt')"
                color="green darken-1"
                text
                @click="openInvoiceReceipt(data.invoicedata)"
                ><v-icon> mdi-receipt </v-icon> Create receipt</v-btn
              >
              <!-- <v-btn color="info darken-1" text @click="cancelInvoiceDialog"
                ><v-icon> mdi-printer </v-icon> Print</v-btn
              > -->
              <v-btn
                v-show="can('delete', 'Receipt')"
                @click="deleteInvoiceItemdefinition(data.invoicedata.id)"
                color="warning darken-1"
                text
                ><v-icon>mdi-arrow-u-left-top-bold</v-icon> Cancel</v-btn
              >
              <v-btn color="red darken-1" text @click="cancelInvoiceDialog"
                >Close</v-btn
              >
            </td>
            <table cellpadding="0" cellspacing="0">
              <v-col class="pa-9" cols="12" sm="12" md="12">
                <v-layout justify-center>
                  <img :src="data.coat" class="login-logo pt-5" />
                </v-layout>
                <v-layout justify-center align="center">
                  <strong>
                    {{ "The United Republic of Tanzania" }}
                  </strong>
                  <br />
                </v-layout>
                <v-layout justify-center align="center">
                  <strong>
                    {{ data.invoicedata.location.name }}
                  </strong>
                  <br />
                </v-layout>
                <v-layout justify-center align="center ">
                  <small>
                    <strong>
                      {{
                        data.invoicedata.facility
                          ? data.invoicedata.facility.name
                          : ""
                      }}
                    </strong>
                  </small>
                </v-layout>
                <v-divider class="underline-title"></v-divider>
              </v-col>
              <v-row no-gutters class="pt-0">
                <v-col cols="12" sm="6" md="4">
                  <v-layout justify-left>
                    <v-card-actions>
                      <div class="text-xs-center">
                        <v-card flat class="pl-2">
                          <strong> Facility Name: </strong>
                          {{
                            data.invoicedata.facility
                              ? data.invoicedata.facility.name
                              : ""
                          }}<br />
                          Address:
                          {{
                            data.invoicedata.facility
                              ? data.invoicedata.facility.postal_address
                              : ""
                          }}<br />
                          Email:
                          {{
                            data.invoicedata.facility
                              ? data.invoicedata.facility.email
                              : ""
                          }}<br />
                          Phone:{{
                            data.invoicedata.facility
                              ? data.invoicedata.facility.phone_number
                              : ""
                          }}
                        </v-card>
                      </div>
                    </v-card-actions>
                  </v-layout>
                </v-col>
                <v-col cols="6" md="4" class="pl-9">
                  <v-card flat class="pa-2">
                    <strong>
                      Invoice #:{{
                        data.invoicedata ? data.invoicedata.invoice_number : ""
                      }}</strong
                    ><br />
                    Created:
                    {{ data.invoicedata ? data.invoicedata.date : "" | format
                    }}<br />
                  </v-card>
                </v-col>
                <v-col cols="6" md="4" class="pl-12">
                  <v-card flat class="pa-2">
                    <strong> Customer Name: </strong>
                    {{
                      data.invoicedata.customer
                        ? data.invoicedata.customer.name
                        : ""
                    }}<br />
                    Address:{{
                      data.invoicedata.customer
                        ? data.invoicedata.customer.address
                        : ""
                    }}<br />
                    Email:{{
                      data.invoicedata.customer
                        ? data.invoicedata.customer.email
                        : ""
                    }}<br />
                    Phone:{{
                      data.invoicedata.customer
                        ? data.invoicedata.customer.phone
                        : ""
                    }}<br />
                  </v-card>
                </v-col>
              </v-row>
              <v-sheet class="pl-3">
                <v-sheet class="information green lighten-5 text-capitalize">
                  <strong> Description:</strong>
                  {{ data.invoicedata.description | capitalizeFirstLatter }}
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
                <strong> Created By:</strong>
                <em>
                  {{
                    data.invoicedata.user
                      ? data.invoicedata.user.first_name
                      : ""
                  }}
                  {{ " " }}
                  {{
                    data.invoicedata.user
                      ? data.invoicedata.user.middle_name
                      : ""
                  }}
                  {{ " " }}
                  {{
                    data.invoicedata.user ? data.invoicedata.user.last_name : ""
                  }}
                </em>
              </v-sheet>
            </table>
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
              <h2>Invoice #:{{ data.invoicereceip.invoice_number }}</h2>
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
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
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
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useInvoice } from "./composables/invoice";
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
      deleteInvoiceItemdefinition,
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
    } = useInvoice();
    return {
      data,
      getData,
      createReceipt,
      addRow,
      removeRow,
      openDialog,
      cancelDialog,
      deleteInvoiceItemdefinition,
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
    };
  },
});
</script>

<style lang="scss">
#p1 {
  text-decoration: underline;
  text-decoration-color: rgba(17, 0, 255, 0.74);
  text-decoration-thickness: 2px;
}

.underline-title {
  border: 1px dashed rgb(196, 17, 17);
  width: 100%;
  border-color: red;
}
.underline-amount {
  border-style: double none none;
}
.underline-invoice-number {
  border-style: none none double;
  border-block-color: rgb(17, 0, 255);
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
  height: 10%;
  width: 10%;
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
