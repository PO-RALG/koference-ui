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
                      @click="viewInvoice(item)"
                      >{{ "VIEW INVOICES" }}</v-list-item
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
                      @click="viewInvoice(item)"
                      >{{ "VIEW INVOICES" }}</v-list-item
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
                      @click="viewInvoice(item)"
                      >{{ "VIEW INVOICES" }}</v-list-item
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
