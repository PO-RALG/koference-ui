<template>
  <div>
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
        :loading="data.loading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-select
                outlined
                prepend-inner-icon="mdi-filter-outline"
                :items="data.itemsToFilter"
                label="Enter Filter Term"
                :item-text="'name'"
                item-value="name"
                @change="reanderSearched($event)"
                v-model="data.search"
              >
                <template v-slot:selection="{ item }">
                  {{ item.invoice_number }}
                </template>
                <template v-slot:item="{ item }">
                  {{ item.invoice_number }}
                </template>
                <template v-slot:prepend-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field
                        clearable
                        outlined
                        dense
                        label="Search"
                        placeholder="Eg: INV-2022-000047"
                        @input="searchCategory"
                        hint="Enter atleast two (2) characters"
                      ></v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.description`]="{ item }">
          <span>
            {{ item.description | capitalizeFirstLatter }}
          </span>
        </template>
        <template v-slot:[`item.payment_date`]="{ item }">
          {{ item.payment_date | format() }}
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>

        <template v-slot:[`item.voucher_number`]="{ item }">
          <v-list-item id="p1" exact light @click="openDialog(item)"
            ><h3>
              {{ item.voucher_number }}
            </h3></v-list-item
          >
        </template>
        <template v-slot:[`item.bank_account`]="{ item }">
          {{ item.bank_account.bank }}
        </template>
        <template v-slot:[`item.pending`]="{ item }">
          {{ (item.amount - item.received_amount) | toCurrency() }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                @click="openMarkStaleDialog(item)"
                v-bind="attrs" v-on="on" class="mr-2"> mdi-check </v-icon>
            </template>
            <span>Mark Stale</span>
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
    <Modal :modal="data.modal" :width="620">
      <template v-slot:header>
        <ModalHeader :title="` Mark Payment as Stale Cheque`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="6"> </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="data.formData.reference_no"
                    label="Stale Check"
                    required
                    outlined
                    :hide-details="true"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="data.formData.amount"
                    label="Amount"
                    required
                    outlined
                    :hide-details="true"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn
            :disabled="cant('create', 'BankAccount', 'update', 'BankAccount')"
            color="green darken-1"
            text
            @click="save"
            >{{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStaleCheque } from "./composables/stale-check";
export default defineComponent({
  name: "ManageInvoice",
  setup() {
    const {
      data,
      getData,
      reloadData,
      searchCategory,
      cancelDialog,
      openDialog,
      save,
    } = useStaleCheque();

    const openMarkStaleDialog = (item) => {
      console.log(item);
    }

    return {
      data,
      getData,
      reloadData,
      openDialog,
      searchCategory,
      cancelDialog,
      save,
      openMarkStaleDialog,
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
