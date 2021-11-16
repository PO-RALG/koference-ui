<template>
  <div class="jv">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="cant('create', 'JournalVoucher')">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="data.items"
        :single-expand="data.singleExpand"
        item-key="id"
        :expanded.sync="data.expanded"
        show-expand
      >
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          <span>{{ item.amount | toCurrency }}</span>
        </template>
        <template v-slot:[`expanded-item`]="{ item }">
          <td :colspan="5" class="pa-2">
            <v-card outlined flat width="100%" max-width="100%">
              <v-data-table :headers="ITEM_HEADERS" :items="item.lines" hide-default-footer dense>
                <template v-slot:[`item.dr_amount`]="{ item }">
                  <span>{{ item.dr_amount | toCurrency }}</span>
                </template>
                <template v-slot:[`item.cr_amount`]="{ item }">
                  <span>{{ item.cr_amount | toCurrency }}</span>
                </template>
              </v-data-table>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="1400">
      <template v-slot:header>
        <ModalHeader :title="`Create Journal Voucher`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row class="pa-3">
                <v-col class="pt-6" cols="12" lg="6" md="6" sm="12">
                  <DatePicker :max="data.maxDate" :label="'JV Date'" v-model="data.jv.date" />
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field label="Description" v-model="data.jv.descriptions"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="pa-3 mt-n12">
                <v-col class="pt-2" cols="12" md="12">
                  <tr class="heading blue-grey lighten-5">
                    <td colspan="3">
                      Add Journal Voucher Item {{ " " }}{{ "by pressing" }}
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
                      <tr v-for="(item, index) in data.jv.lines" :key="index" class="invoice-tr">
                        <td>
                          <v-select
                            :items="data.fundingSources"
                            :item-text="'description'"
                            v-model="item.funding_source_code"
                            :name="`data.jv.lines[${index}][fund_source_code]`"
                            label="Select Fund Source"
                            item-value="code"
                            full-width
                            dense
                            outlined
                            item-disabled="disabled"
                            @change="loadGLAccounts($event, index)"
                            hide-details
                          ></v-select>
                        </td>
                        <td>
                          <v-select
                            :items="data.gl_accounts[index]"
                            :item-text="'code'"
                            v-model="item.account"
                            :name="`data.jv.lines[${index}][account]`"
                            label="Select GL Account"
                            item-value="code"
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
                            @blur="checkDrAmount(`${index}`)"
                            v-model="item.dr_amount"
                            :name="`data.jv.lines[${index}][dr_amount]`"
                          >
                          </v-text-field>
                        </td>
                        <td class="invoice-td">
                          <v-text-field
                            dense
                            hide-details
                            outlined
                            type="number"
                            @blur="checkCrAmount(`${index}`)"
                            v-model="item.cr_amount"
                            :name="`data.jv.lines[${index}][cr_amount]`"
                          >
                          </v-text-field>
                        </td>
                        <td>
                          <v-btn
                            color="blue darken-1"
                            small
                            text
                            v-if="index || (!index && data.jv.lines.length > 1)"
                            @click="removeRow(index)"
                          >
                            <v-icon small color="red"> mdi-minus-circle </v-icon>
                          </v-btn>
                          <v-btn
                            small
                            color="blue darken-1"
                            text
                            @click="addRow"
                            v-if="index == data.jv.lines.length - 1"
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
            <!--<pre>{{ data.jv }}</pre>-->
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Create</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useJv } from "./composables/journal-voucher";

export default defineComponent({
  setup() {
    const {
      data,
      openDialog,
      getData,
      save,
      cancelDialog,
      addRow,
      removeRow,
      HEADERS,
      accounts,
      checkCrAmount,
      checkDrAmount,
      refillAccounts,
      total,
      loadGLAccounts,
    } = useJv();

    const headers = [
      { text: "Number", value: "number" },
      { text: "Date", value: "date" },
      { text: "Description", value: "descriptions" },
      { text: "Amount", value: "amount" },
    ];

    const ITEM_HEADERS = [
      { text: "ACCOUNT", value: "account" },
      { text: "DR", value: "dr_amount" },
      { text: "CR", value: "cr_amount" },
    ];

    return {
      data,
      headers,
      ITEM_HEADERS,
      openDialog,
      getData,
      save,
      cancelDialog,
      addRow,
      removeRow,
      HEADERS,
      accounts,
      checkCrAmount,
      checkDrAmount,
      refillAccounts,
      total,
      loadGLAccounts,
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

/*remove arrow in number inputs*/
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input-group--text-field.input-group--dirty:not(.input-group--textarea) label,
.input-group--text-field:not(.input-group--single-line).input-group--focused:not(.input-group--textarea) label,
.input-group--text-field:not(.input-group--single-line):focus:not(.input-group--textarea) label {
  min-width: 133%; /* This makes label same width as input when transformed above the input */
}
// remove elipsis from select menu
// .v-select.v-text-field input {
  // width: 64px !important;
//}

.ledger-summary {
  background: #eeeeee;
}
</style>
