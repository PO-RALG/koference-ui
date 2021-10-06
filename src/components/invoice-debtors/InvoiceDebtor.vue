<template>
  <div class="customers">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        :single-expand="true"
        class="elevation-1"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <!-- <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Name"
                @change="searchCategory($event)"
                :items="data.itemsToFilter"
                :item-text="'name'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col> -->
          </v-card-title>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-list-item
            class="font-italic"
            exact
            light
            @click="viewInvoice(item)"
            >{{ "VIEW INVOICES" }}</v-list-item
          >
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
    <Modal :modal="data.viewInvoiceDialog" :width="1080">
      <template v-slot:header>
        <ModalHeader :title="`List of Customer's Invoices`" />
      </template>
      <template v-slot:body>
        <ModalBody flat v-if="data.invoices">
          <v-data-table
            dense
            :headers="data.invoice_headers"
            :items="data.invoices"
            :single-expand="true"
            class="elevation-0"
            disable-pagination
            hide-default-footer
            :loading="data.loading"
            loading-text="Loading... Please wait"
          >
            <template v-slot:[`item.invoice_number`]="{ item }">
              <v-list-item @click="previewInvoice(item)">{{
                item.invoice_number
              }}</v-list-item>
            </template>
            <template v-slot:[`item.date`]="{ item }">
              <v-list-item exact light>{{ item.date | format() }}</v-list-item>
            </template>
            <template v-slot:[`item.pending`]="{ item }">
              <v-list-item exact light>{{
                item.amount - item.received_amount
              }}</v-list-item>
            </template>
            <template v-slot:top>
              <v-card-title>
                <span v-if="data">
                  <v-icon></v-icon>
                  Customer:
                  <small>
                    {{ data.selectedDebtor.name }}
                  </small>
                </span>
                <span v-if="data">
                  <v-icon></v-icon>
                  Phone:
                  <small>
                    {{ data.selectedDebtor.phone }}
                  </small>
                </span>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="cancelDialog"
                  >Close</v-btn
                >
              </v-card-title>
            </template>

            <template v-slot:footer>
              <Paginate
                :params="data.response"
                :rows="data.rows"
                @onPageChange="getData"
              />
            </template>
          </v-data-table>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter> </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.invoicedetails" :width="1000">
      <template v-slot:header>
        <ModalHeader :title="`Invoice Details`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="invoice-box" v-if="data.invoiceData">
            <table cellpadding="0" cellspacing="0">
              <tr class="top">
                <td colspan="4">
                  <table>
                    <tr>
                      <td class="title">
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
                      </td>

                      <td>
                        <strong>
                          Invoice #:{{
                            data.invoiceData
                              ? data.invoiceData.invoice_number
                              : ""
                          }}</strong
                        ><br />
                        Created:
                        {{
                          data.invoiceData
                            ? data.invoiceData.date
                            : "" | format
                        }}<br />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr class="information">
                <td colspan="4">
                  <table>
                    <tr v-if="data.invoiceData">
                      <td>
                        <img :src="data.coat" class="login-logo pt-5" /><br />
                        <strong> Facility Name: </strong>
                        {{
                          data.invoiceData.facility
                            ? data.invoiceData.facility.name
                            : ""
                        }}<br />
                        Address:
                        {{
                          data.invoiceData.facility
                            ? data.invoiceData.facility.postal_address
                            : ""
                        }}<br />
                        Email:
                        {{
                          data.invoiceData.facility
                            ? data.invoiceData.facility.email
                            : ""
                        }}<br />
                        Phone:{{
                          data.invoiceData.facility
                            ? data.invoiceData.facility.phone_number
                            : ""
                        }}
                      </td>

                      <td>
                        <strong> Customer Name: </strong>
                        {{
                          data.invoiceData.customer
                            ? data.invoiceData.customer.name
                            : ""
                        }}<br />
                        Address:{{
                          data.invoiceData.customer
                            ? data.invoiceData.customer.address
                            : ""
                        }}<br />
                        Email:{{
                          data.invoiceData.customer
                            ? data.invoiceData.customer.email
                            : ""
                        }}<br />
                        Phone:{{
                          data.invoiceData.customer
                            ? data.invoiceData.customer.phone
                            : ""
                        }}<br />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <v-data-table
                :headers="data.HEADERS_INVOICE_DETAILS"
                :items="data.items"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:body>
                  <tr
                    v-for="item in data.invoiceData.invoice_items"
                    :key="item.id"
                    class="invoice-tr"
                  >
                    <td>
                      <v-text-field
                        :hide-details="true"
                        disabled
                        flat
                        dense
                        filled
                        v-model="item.definition.name"
                      >
                      </v-text-field>
                    </td>

                    <td class="invoice-td">
                      <!-- {{ item }} -->
                      <v-text-field
                        :hide-details="true"
                        disabled
                        flat
                        filled
                        dense
                        v-model="item.received_amount"
                      >
                      </v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        :hide-details="true"
                        type="number"
                        disabled
                        flat
                        dense
                        filled
                        reverse
                        v-model="item.amount"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        :hide-details="true"
                        type="number"
                        disabled
                        flat
                        dense
                        filled
                        reverse
                        :value="item.amount - item.received_amount"
                      ></v-text-field>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </table>
          </div>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter> </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

import { useInvoiceDebtor } from "./composables/invoice-debtors";

export default defineComponent({
  name: "InvoiceDebtor",
  setup() {
    const {
      data,
      getData,
      cancelDialog,
      viewInvoice,
      getInvoiceDebtor,
      reloadData,
      cancelConfirmDialog,
      searchCategory,
      previewInvoice,
      cancelInvoiceDialog,
    } = useInvoiceDebtor();

    return {
      data,
      getData,
      cancelDialog,
      viewInvoice,
      getInvoiceDebtor,
      reloadData,
      cancelConfirmDialog,
      searchCategory,
      previewInvoice,
      cancelInvoiceDialog,
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
