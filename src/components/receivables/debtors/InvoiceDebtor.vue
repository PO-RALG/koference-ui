<template>
  <div class="customers">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-container>
      <v-row>
        <v-col sm="12">
          <v-row no-gutters>
            <v-col cols="12" sm="4">
              <v-card flat class="pa-2" outlined tile>
                Debtors age less than <strong>30 days</strong>
              </v-card>

              <v-card flat>
                <v-data-table
                  :headers="data.headers"
                  :items="newDetorsWithin30Days"
                  :single-expand="true"
                  class="elevation-1 green lighten-5"
                  disable-pagination
                  hide-default-footer
                >
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-list-item
                      class="font-italic"
                      exact
                      light
                      @click="previewInvoice(item)"
                      >{{ "VIEW INVOICE" }}</v-list-item
                    >
                  </template>

                  <template v-slot:[`item.customer`]="{ item }">
                    <small>{{ item.customer.name }}</small>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4">
              <v-card flat class="pa-2" outlined tile>
                Debtors age greater than <strong>30 days</strong> less than
                <strong>90 days</strong>
              </v-card>

              <v-card flat>
                <v-data-table
                  :headers="data.headers"
                  :items="newDetorsBelow30Days"
                  :single-expand="true"
                  class="elevation-1 yellow lighten-5"
                  disable-pagination
                  hide-default-footer
                >
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-list-item
                      class="font-italic"
                      exact
                      light
                      @click="previewInvoice(item)"
                      >{{ "VIEW INVOICE" }}</v-list-item
                    >
                  </template>
                  <template v-slot:[`item.customer`]="{ item }">
                    <small>{{ item.customer.name }}</small>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card flat class="pa-2" outlined tile>
                Debtors age greater than <strong>90 days</strong>
              </v-card>

              <v-card flat>
                <v-data-table
                  :headers="data.headers"
                  :items="newDetorsGreater90Days"
                  :single-expand="true"
                  class="elevation-1 red lighten-5"
                  disable-pagination
                  hide-default-footer
                >
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-list-item
                      class="font-italic"
                      exact
                      light
                      @click="previewInvoice(item)"
                      >{{ "VIEW INVOICE" }}</v-list-item
                    >
                  </template>

                  <template v-slot:[`item.customer`]="{ item }">
                    <small>{{ item.customer.name }}</small>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <Modal :fullScreen="true" :modal="data.invoicedetails" :width="1120">
        <template v-slot:header>
          <ModalHeader :title="`Invoice Details`" />
        </template>
        <template v-slot:body>
          <ModalBody>
            <div class="invoice-box" v-if="data.invoiceData">
              <td class="title">
                <v-btn color="red darken-1" text @click="cancelInvoiceDialog"
                  >Close</v-btn
                >
              </td>
              <table cellpadding="0" cellspacing="0">
                <v-col class="pa-9" cols="12" sm="12" md="12">
                  <v-layout justify-center>
                    <img :src="data.coat" class="login-logo pt-2" />
                  </v-layout>
                  <v-layout justify-center align="center">
                    <strong>
                      {{ "The United Republic of Tanzania" }}
                    </strong>
                    <br />
                  </v-layout>
                  <v-layout justify-center align="center">
                    <strong>
                      {{
                        "President's Office, Regional Administration and Local Government(PO-RALG)"
                      }}
                    </strong>
                    <br />
                  </v-layout>
                  <v-layout justify-center align="center">
                    <strong>
                      {{ data.invoiceData.location.name }}
                    </strong>
                    <br />
                  </v-layout>
                  <v-layout justify-center align="center ">
                    <strong>
                      {{
                        data.invoiceData.facility
                          ? data.invoiceData.facility.name
                          : ""
                      }}
                    </strong>
                  </v-layout>
                  <v-layout justify-center align="center ">
                    <strong> <small>Address:</small> </strong>
                    <strong>
                      <small>
                        {{
                          data.invoiceData.facility
                            ? data.invoiceData.facility.postal_address
                            : ""
                        }}</small
                      ><br />
                    </strong>
                  </v-layout>
                  <v-layout justify-center align="center ">
                    <strong> <small>Email:</small> </strong>
                    <strong>
                      <small>
                        {{
                          data.invoiceData.facility
                            ? data.invoiceData.facility.email
                            : ""
                        }}</small
                      ><br />
                    </strong>
                  </v-layout>
                  <v-layout justify-center align="center ">
                    <strong> <small>Phone:</small> </strong>
                    <em>
                      {{
                        data.invoiceData.facility
                          ? data.invoiceData.facility.phone_number
                          : ""
                      }}<br />
                    </em>
                  </v-layout>

                  <v-divider class="underline-title"></v-divider>
                </v-col>
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
                  :headers="data.HEADERS_INVOICE_DETAILS"
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
                      data.invoiceData.user
                        ? data.invoiceData.user.first_name
                        : ""
                    }}
                    {{ " " }}
                    {{
                      data.invoiceData.user
                        ? data.invoiceData.user.middle_name
                        : ""
                    }}
                    {{ " " }}
                    {{
                      data.invoiceData.user
                        ? data.invoiceData.user.last_name
                        : ""
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
    </v-container>
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
      newDetorsWithin30Days,
      newDetorsBelow30Days,
      newDetorsGreater90Days,
      newInvoiceItem,
      sumDebts,
      invoicedAmount,
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
      newDetorsWithin30Days,
      newDetorsBelow30Days,
      newDetorsGreater90Days,
      newInvoiceItem,
      sumDebts,
      invoicedAmount,
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
