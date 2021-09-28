<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog">
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
        <template v-slot:[`item.date`]="{ item }">
          <v-list-item exact light>{{ item.date | format() }}</v-list-item>
        </template>
        <template v-slot:[`item.invoice_number`]="{ item }">
          <v-list-item exact light @click="previewInvoice(item)">{{ item.invoice_number }}</v-list-item>
        </template>

        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="860">
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
                  <DatePicker :label="'Ivoice Date'" v-model="data.formData.date" />
                </v-col>
                <v-col cols="12" md="12" class="mt-n8">
                  <v-text-field label="Description" v-model="data.formData.description"></v-text-field>
                </v-col>
                <v-col class="pt-2" cols="12" md="12">
                  <tr class="heading blue-grey lighten-5">
                    <td colspan="3">
                      Add invoice item {{ " " }}{{ "by pressing" }}
                      <v-icon small color="success"> mdi-plus-circle </v-icon>
                      {{ " " }} {{ "or" }} {{ "remove by pressing " }}{{ " " }}
                      <v-icon small color="red"> mdi-minus-circle </v-icon>{{ " " }}{{ "sign in the right" }}
                      {{ " " }}
                      <v-icon color=""> mdi-arrow-right-bold </v-icon>
                    </td>
                  </tr>
                </v-col>
                <v-col class="pt-2 invoice-table" cols="12" md="12">
                  <v-data-table :headers="HEADERS" :items="data.items" disable-pagination hide-default-footer>
                    <template v-slot:body>
                      <tr v-for="(invoice, index) in data.invoice_items" :key="index" class="invoice-tr">
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
                            v-model="invoice.amount"
                            :name="`data.invoice_items[${index}][name]`"
                          >
                          </v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field
                            dense
                            hide-details
                            outlined
                            v-model="invoice.amount_received"
                            :name="`data.invoice_items[${index}][name]`"
                          >
                          </v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field
                            dense
                            hide-details
                            outlined
                            v-model="invoice.amount_pending"
                            :name="`data.invoice_items[${index}][name]`"
                          >
                          </v-text-field>
                        </td>
                        <td>
                          <v-btn
                            color="blue darken-1"
                            small
                            text
                            v-if="index || (!index && data.invoice_items.length > 1)"
                            @click="removeRow(index)"
                          >
                            <v-icon small color="red"> mdi-minus-circle </v-icon>
                          </v-btn>
                          <v-btn
                            small
                            color="blue darken-1"
                            text
                            @click="addRow"
                            v-if="index == data.invoice_items.length - 1"
                          >
                            <v-icon small color="success"> mdi-plus-circle </v-icon>
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
          <v-btn color="green darken-1" text @click="save">{{ data.modalTitle }} </v-btn>
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
          <v-btn color="blue darken-1" text @click="cancelConfirmDialog">No</v-btn>
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.invoicedetails" :width="1000">
      <template v-slot:header>
        <ModalHeader :title="`Invoice Details`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="invoice-box" v-if="data.invoicedata">
            <table cellpadding="0" cellspacing="0">
              <tr class="top">
                <td colspan="4">
                  <table>
                    <tr>
                      <td class="title">
                        <v-btn color="green darken-1" text @click="openInvoiceReceipt(data.invoicedata)"
                          ><v-icon> mdi-receipt </v-icon> Create receipt</v-btn
                        >
                        <v-btn color="info darken-1" text @click="cancelInvoiceDialog"
                          ><v-icon> mdi-printer </v-icon> Print</v-btn
                        >
                        <v-btn @click="deleteInvoiceItemdefinition(data.invoicedata.id)" color="warning darken-1" text
                          ><v-icon>mdi-arrow-u-left-top-bold</v-icon> Cancel</v-btn
                        >
                        <v-btn color="red darken-1" text @click="cancelInvoiceDialog">Close</v-btn>
                      </td>

                      <td>
                        <strong> Invoice #:{{ data.invoicedata ? data.invoicedata.invoice_number : "" }}</strong
                        ><br />
                        Created:
                        {{ data.invoicedata ? data.invoicedata.date : "" | format }}<br />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr class="information">
                <td colspan="4">
                  <table>
                    <tr v-if="data.invoicedata">
                      <td>
                        <img :src="data.coat" class="login-logo pt-5" /><br />
                        <strong> Facility Name: </strong>
                        {{ data.invoicedata.facility ? data.invoicedata.facility.name : "" }}<br />
                        Address:
                        {{ data.invoicedata.facility ? data.invoicedata.facility.postal_address : "" }}<br />
                        Email:
                        {{ data.invoicedata.facility ? data.invoicedata.facility.email : "" }}<br />
                        Phone:{{ data.invoicedata.facility ? data.invoicedata.facility.phone_number : "" }}
                      </td>

                      <td>
                        <strong> Customer Name: </strong>
                        {{ data.invoicedata.customer ? data.invoicedata.customer.name : "" }}<br />
                        Address:{{ data.invoicedata.customer ? data.invoicedata.customer.address : "" }}<br />
                        Email:{{ data.invoicedata.customer ? data.invoicedata.customer.email : "" }}<br />
                        Phone:{{ data.invoicedata.customer ? data.invoicedata.customer.phone : "" }}<br />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr class="heading">
                <td colspan="3">Invoice Items</td>
                <td>Amount(TZS)</td>
              </tr>
              <tr class="heading"></tr>

              <tr class="item" v-for="item in data.invoicedata.invoice_items" :key="item.id">
                <td colspan="3">
                  <v-text-field :hide-details="true" disabled flat label="Item name" v-model="item.definition.name">
                  </v-text-field>
                </td>
                <td width="30%">
                  <v-text-field
                    :hide-details="true"
                    type="number"
                    disabled
                    flat
                    reverse
                    v-model="item.amount"
                  ></v-text-field>
                </td>
                <td></td>
              </tr>

              <tr class="total">
                <td colspan="3"></td>
                <td>
                  <strong> Total:{{ data.invoicedata.amount }} </strong>
                  <v-icon small>mdi-slash-forward</v-icon>
                  <v-icon small class="">mdi-equal</v-icon>
                </td>
              </tr>
            </table>
          </div>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter> </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.invoicereceipt" :width="900">
      <template v-slot:header>
        <ModalHeader :title="`Invoice Receipt`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <!-- <pre>
            {{ data.invoicedata.invoice_items }}
          </pre> -->
          <v-form>
            <v-container>
              <v-row class="mt-n8 pa-5">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="data.invoicereceip.customer_id"
                    label="Select Customer"
                    :items="data.customer"
                    :item-text="'customer.name'"
                    item-value="customer.id"
                  ></v-autocomplete>
                </v-col>
                <v-col class="pt-6" cols="12" md="6">
                  <DatePicker v-model="data.invoicereceip.date" :label="'Receipt Date'" />
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
                <!-- <pre>{{ data.customer }}</pre> -->
                <v-col class="pt-2 invoice-table" cols="12" md="12">
                  <v-data-table :headers="RECEIPTHEADERS" :items="data.items" disable-pagination hide-default-footer>
                    <template v-slot:body>
                      <tr v-for="(invoice, index) in data.invoicereceip.items" :key="index" class="invoice-tr">
                        <td>
                          <v-text-field outlined dense hide-details v-model="invoice.itemName"></v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field outlined dense hide-details v-model="invoice.invoicedAmount"></v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field outlined dense hide-details v-model="invoice.received"></v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field
                            outlined
                            dense
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
          <v-btn color="red darken-1" text @click="cancelInvoiceReceipt">Close</v-btn>
          <v-btn color="green darken-1" text @click="createReceipt"> Create</v-btn>
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
    };
  },
});
</script>

<style lang="scss">
.invoice-box {
  max-width: 1000px;
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
  height: 14%;
  width: 14%;
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
