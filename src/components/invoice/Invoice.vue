<template>
  <div class="Invoice">
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
        <template v-slot:[`item.invoice_number`]="{ item }">
          <v-list-item exact light @click="previewInvoice(item)">{{
            item.invoice_number
            }}</v-list-item>
        </template>

        <template v-slot:item.actions="{ item }">
          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
            <v-icon
            v-bind="attrs"
            v-on="on"
            class="mr-2"
            @click="openDialog(item)"
            >
            mdi-pencil-box-outline
            </v-icon>
            </template>
            <span>Edit</span>
            </v-tooltip> -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteInvoiceItemdefinition(item.id)"
                  >mdi-arrow-u-left-top-bold</v-icon
                >
              </template>
              <span>Reverse</span>
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
              <DatePicker
                :label="'Ivoice Date'"
                v-model="data.formData.date"
                />
            </v-col>
            <v-col cols="12" md="12">
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
            <v-row
              class="mt-n8 pa-3"
              text-center
              v-for="(invoice, index) in data.invoice_items"
              :key="index"
              hide-details
              >
              <v-col cols="4" lg="6" md="6" sm="12">
                <v-select
                  :items="data.itemdefinitions"
                  :item-text="'name'"
                  v-model="invoice.invoice_item_definition_id"
                  :name="`data.invoice_items[${index}][invoice_item_definition_id]`"
                  label="Select Ivoice Item"
                  item-value="id"
                  outlined
                  dense
                  hide-details
                  ></v-select>
              </v-col>

              <v-col cols="4" lg="4" md="4" sm="12">
                <!-- :rules="formValidation.streamNameRules"-->
                <v-text-field
                  label="Add Amount"
                  outlined
                  dense
                  hide-details
                  v-model="invoice.amount"
                  :name="`data.invoice_items[${index}][name]`"
                  ></v-text-field>
              </v-col>

              <v-col col="3" lg="1" class="d-flex pt-7 pr-12">
                <v-btn
                  color="blue darken-1"
                  text
                  v-if="index || (!index && data.invoice_items.length > 1)"
                  @click="removeRow(index)"
                  >
                  <v-icon small color="red"> mdi-minus-circle </v-icon>
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="addRow"
                  v-if="index == data.invoice_items.length - 1"
                  >
                  <v-icon small color="success"> mdi-plus-circle </v-icon>
                </v-btn>
              </v-col>
            </v-row>
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
      <ModalHeader :title="`Reverse Invoice `" />
    </template>
    <template v-slot:body>
      <ModalBody> Are you sure you want to reverse this invoice? </ModalBody>
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

    <Modal :modal="data.invoicedetails" :width="900">
    <template v-slot:header>
      <ModalHeader :title="`Invoice Details`" />
    </template>
    <template v-slot:body>
      <ModalBody>
      <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
          <tr class="top">
            <td colspan="4">
              <table>
                <tr>
                  <td class="title">
                    <v-btn
                      color="green darken-1"
                      text
                      @click="cancelInvoiceDialog"
                      ><v-icon> mdi-receipt </v-icon> Create receipt</v-btn
                    >
                    <v-btn
                      color="info darken-1"
                      text
                      @click="cancelInvoiceDialog"
                      ><v-icon> mdi-printer </v-icon> Print</v-btn
                    >

                    <v-btn
                      color="red darken-1"
                      text
                      @click="cancelInvoiceDialog"
                      >Close</v-btn
                    >
                    <!-- <img
                      src="https://www.sparksuite.com/images/logo.png"
                      style="width: 100%; max-width: 300px"
                      /> -->
                  </td>

                  <td>
                    <strong>
                      Invoice #:{{
                      data.invoicedata.invoice_number
                      }}</strong
                    ><br />
                    Created: {{ data.invoicedata.date | myDate }}<br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr class="information">
            <td colspan="4">
              <table>
                <tr>
                  <td>
                    <img :src="data.coat" class="login-logo pt-5" /><br />
                    Sparksuite, Inc.<br />
                    12345 Sunny Road<br />
                    Sunnyville, CA 12345
                  </td>

                  <td>
                    <strong> Customer Name: </strong>
                    {{ data.invoicedata.customer.name }}<br />
                    Address:{{ data.invoicedata.customer.address }}<br />
                    Email:{{ data.invoicedata.customer.email }}<br />
                    Phone:{{ data.invoicedata.customer.phone }}<br />
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

          <tr
            class="item"
            v-for="item in data.invoicedata.invoice_items"
            :key="item.id"
            >
            <td colspan="3">
              <v-text-field
                :hide-details="true"
                disabled
                flat
                label="Item name"
                v-model="item.definition.name"
                >
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
            <!-- <td>${{ (item.price * item.quantity) | currency }}</td> -->
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
      <ModalFooter>
      <!-- <v-btn color="green darken-1" text @click="cancelInvoiceDialog"
        ><v-icon> mdi-receipt </v-icon> Create receipt</v-btn
        >
        <v-btn color="info darken-1" text @click="cancelInvoiceDialog"
        ><v-icon> mdi-printer </v-icon> Print</v-btn
        >

        <v-btn color="red darken-1" text @click="cancelInvoiceDialog"
        >Close</v-btn
        > -->
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
    } = useInvoice();

    return {
      data,
      getData,
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
    };
  },
});
</script>

<style>
.invoice-box {
  max-width: 850px;
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
</style>
