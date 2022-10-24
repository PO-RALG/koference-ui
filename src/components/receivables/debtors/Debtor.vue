<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="invoices"
        hide-default-footer
        class="elevation-1"
        disable-pagination
      >
        <template v-slot:[`item.invoice_number`]="{ item }">
          <span>
            <v-list-item
              class="text-link"
              exact
              light
              @click="previewInvoice(item)"
            >
              {{ item.invoice_number }}
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
        <template v-slot:[`item.below_30`]="{ item }">
          <span v-if="item.age < 30">
            {{ item.amount | toCurrency() }}
          </span>
        </template>
        <template v-slot:[`item.between_30_60`]="{ item }">
          <span v-if="item.age >= 30 && item.age <= 60">
            {{ item.amount | toCurrency() }}
          </span>
        </template>
        <template v-slot:[`item.between_60_90`]="{ item }">
          <span v-if="item.age >= 60 && item.age <= 90">
            {{ item.amount | toCurrency() }}
          </span>
        </template>
        <template v-slot:[`item.between_90_120`]="{ item }">
          <span v-if="item.age >= 90 && item.age < 120">
            {{ item.amount | toCurrency() }}
          </span>
        </template>
        <template v-slot:[`item.above_120`]="{ item }">
          <span v-if="item.age > 120">
            {{ item.amount | toCurrency() }}
          </span>
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
    <Modal :fullScreen="true" :modal="data.showInvoiceDialog">
      <template v-slot:header>
        <ModalHeader :title="`Invoice Details`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="invoice-box" v-if="data.selectedInvoice">
            <AppLocationHeader
              :facility="data.selectedInvoice.facility"
              :location="data.selectedInvoice.location"
              :facility-type="data.selectedInvoice.faciliType"
              :title="'Payment Voucher'"
            />
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
                          data.selectedInvoice
                            ? data.selectedInvoice.invoice_number
                            : ""
                        }}</strong
                      ><br />
                      <strong>
                        Created:
                        {{
                          data.selectedInvoice
                            ? data.selectedInvoice.date
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
                  {{ data.selectedInvoice.description | capitalizeFirstLatter }}
                </span>
              </v-sheet>
            </v-sheet>

            <v-data-table
              :headers="data.ITEM_DETAILS"
              :items="data.selectedInvoice.invoiceItems"
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
                    item.name
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
                        {{ data.selectedInvoice.totalAmt | toCurrency() }}
                      </h2>
                    </span>
                    <span v-if="header.value == 'received_amount'">
                      <h2 class="underline-amount">
                        {{ data.selectedInvoice.receivedAmt | toCurrency() }}
                      </h2>
                    </span>
                    <span v-if="header.value == 'balance_amount'">
                      <h2 class="underline-amount">
                        {{ data.selectedInvoice.pendingAmt | toCurrency() }}
                      </h2>
                    </span>
                  </th>
                </tr>
              </template>
            </v-data-table>
            <v-card-actions class="pa-0">
              <v-sheet class="text-capitalize pt-10">
                <strong> Created By:</strong>
                <em>
                  {{
                    data.selectedInvoice.user
                      ? data.selectedInvoice.user.first_name
                      : ""
                  }}
                  {{ " " }}
                  {{
                    data.selectedInvoice.user
                      ? data.selectedInvoice.user.middle_name
                      : ""
                  }}
                  {{ " " }}
                  {{
                    data.selectedInvoice.user
                      ? data.selectedInvoice.user.last_name
                      : ""
                  }}
                </em>
              </v-sheet>
              <v-spacer></v-spacer>
              <v-btn color="black" outlined @click="cancelInvoiceDialog">
                <v-icon>mdi-window-close</v-icon>
                close
              </v-btn>
            </v-card-actions>
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
import { defineComponent } from "vue";
import { useDebtor } from "./composables/invoice-debtors";

export default defineComponent({
  name: "Debtor",
  setup() {
    const {
      data,
      getData,
      getInvoiceDebtor,
      previewInvoice,
      cancelInvoiceDialog,
      invoices,
    } = useDebtor();

    return {
      data,
      getData,
      getInvoiceDebtor,
      previewInvoice,
      cancelInvoiceDialog,
      invoices,
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

.underline-amount {
  border-style: double none double;
}
.underline-invoice-number {
  border-style: none none double;
  border-block-color: rgba(0, 110, 255, 0.76);
}
</style>
