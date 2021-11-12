<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn :disabled="cant('create', 'Receipt')" color="primary" @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        Create Receipt
      </v-btn>
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
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter By Invoice Number"
                @change="searchCategory($event)"
                :items="data.itemsToFilter"
                :item-text="'receipt_number'"
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
            {{ item.newData.description }}
          </span>
        </template>

        <template v-slot:[`item.date`]="{ item }">
          {{ item.date | format() }}
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
          <v-tooltip :disabled="cant('edit', 'BankAccount')" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="print(item.id)" text color="green">
                <v-icon :disabled="cant('edit', 'BankAccount')" v-bind="attrs" v-on="on" class="mr-2">
                  mdi-printer
                </v-icon>
              </v-btn>
            </template>
            <span>Print</span>
          </v-tooltip>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
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
              <v-row class="mt-n8 pa-5">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="data.receipt.customer_id"
                    label="Select Customer"
                    :items="data.customers"
                    :item-text="'name'"
                    item-value="id"
                    small
                  ></v-autocomplete>
                </v-col>
                <v-col class="pt-6" cols="12" md="6">
                  <DatePicker :label="'Ivoice Date'" v-model="data.receipt.date" />
                </v-col>
                <v-col cols="12" md="6" class="mt-n8">
                  <v-text-field
                    label="Bank Reference Number"
                    v-model="data.receipt.bank_reference_number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mt-n8">
                  <v-text-field label="Description" v-model="data.receipt.description"></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-autocomplete
                    v-model="data.receipt.bank_account_id"
                    label="Select Bank Account"
                    :items="bankName"
                    :item-text="`fullName`"
                    item-value="id"
                  ></v-autocomplete>
                </v-col>

                <v-col class="pt-2" cols="12" md="12">
                  <tr class="heading blue-grey lighten-5">
                    <td colspan="3">
                      Add GLAccount {{ " " }}{{ "by pressing" }}
                      <v-icon small color="success"> mdi-plus-circle </v-icon>
                      {{ " " }} {{ "or" }} {{ "remove by pressing " }}{{ " " }}
                      <v-icon small color="red"> mdi-minus-circle </v-icon>{{ " " }}{{ "sign in the right" }}
                      {{ " " }}
                      <v-icon color=""> mdi-arrow-right-bold </v-icon>
                    </td>
                  </tr>
                </v-col>
                <v-col class="pt-2 invoice-table" cols="12" md="12">
                  <v-data-table :headers="HEADERS" :items="data.lines" disable-pagination hide-default-footer>
                    <template v-slot:body>
                      <tr v-for="(line, index) in data.receipt.lines" :key="index" class="invoice-tr">
                        <td>
                          <v-select
                            :items="data.fundingSources"
                            :item-text="'description'"
                            v-model="line.funding_source_code"
                            :name="`data.receipt.lines[${index}][fund_source_code]`"
                            label="Select Fund Source"
                            item-value="id"
                            full-width
                            dense
                            outlined
                            item-disabled="disabled"
                            @change="loadGLAccounts($event, index)"
                            hide-details
                            return-object
                          ></v-select>
                        </td>

                        <td class="invoice-td">
                          <v-select
                            :items="data.gl_accounts[index]"
                            :item-text="'code'"
                            v-model="line.gl_account_id"
                            :name="`data.receipt.lines[${index}][gl_account_id]`"
                            label="Select GL Account"
                            item-value="id"
                            full-width
                            dense
                            outlined
                            item-disabled="disabled"
                            hide-details
                          ></v-select>
                        </td>

                        <td class="invoice-td">
                          <v-text-field
                            dense
                            hide-details
                            outlined
                            type="number"
                            v-model="line.amount"
                            :name="`data.receipt.lines[${index}][amount]`"
                          >
                          </v-text-field>
                        </td>
                        <td>
                          <v-btn
                            color="blue darken-1"
                            small
                            text
                            v-if="index || (!index && data.receipt.lines.length > 1)"
                            @click="removeRow(index)"
                          >
                            <v-icon small color="red"> mdi-minus-circle </v-icon>
                          </v-btn>
                          <v-btn
                            small
                            color="blue darken-1"
                            text
                            @click="addRow"
                            v-if="index == data.receipt.lines.length - 1"
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
            <!--<pre>{{ data.receipt }}</pre>-->
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useReceipt } from "./composables/receipt";
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
      bankName,
      newInvoiceItems,
      fundingSourceName,
      checkDublicate,
      newreceiptItem,
      print,
      HEADERS,
      loadGLAccounts,
    } = useReceipt();

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
      bankName,
      newInvoiceItems,
      fundingSourceName,
      checkDublicate,
      newreceiptItem,
      print,
      HEADERS,
      loadGLAccounts,
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
