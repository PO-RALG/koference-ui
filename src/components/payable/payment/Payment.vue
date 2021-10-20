<template>
  <div class="Payment">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'Payment')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        hide-default-footer
        class="elevation-1"
        disable-pagination
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Reference number"
                @change="searchItem($event)"
                :items="data.itemsToFilter"
                :item-text="'reference_no'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            @click="openConfirmDialog(item.id)"
            :disabled="cant('delete', 'Payment')"
          >
            mdi-trash-can-outline
          </v-icon>
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

    <Modal :modal="data.modal" :width="1260">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Payment`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row class="pa-2 pb-5">
                <v-col cols="12" md="3">
                  <DatePicker
                    :label="'Date'"
                    v-model="data.formData.payment_date"
                    required
                  />
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-select
                    v-model="data.formData.bank_account_id"
                    :items="data.bankAccounts"
                    item-text="name"
                    item-value="id"
                    label="Select Bank Account"
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-select
                    v-model="data.formData.cheque_type"
                    :items="data.chequeTypes"
                    label="Select Cheque Type"
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-text-field
                    v-model="data.formData.cheque"
                    label="Cheque"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-select
                    v-model="data.formData.voucher_id"
                    :items="data.paymentVouchers"
                    item-text="reference_no"
                    item-value="id"
                    label="Select PV"
                    @change="setPayableItems($event)"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="9" sm="12">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
                  ></v-text-field>
                </v-col>
              </v-row>
              <template>
                <v-col cols="12" md="12" class="data-table">
                  <v-data-table
                    :headers="payableHeader"
                    disable-pagination
                    hide-default-footer
                  >
                    <template v-slot:body>
                      <tbody>
                        <tr v-for="(payable, i) in data.payables" :key="i">
                          <td>
                            <v-select
                              class="pt-3"
                              outlined
                              dense
                              v-model="payable.payable_id"
                              :items="data.payableItems"
                              item-text="description"
                              item-value="id"
                              @change="setAmount($event,i)"
                            >
                            </v-select>
                          </td>
                          <td>
                            <v-text-field
                              class="pt-3"
                              outlined
                              dense
                              type="number"
                              v-model="payable.required_amount"
                              disabled
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              class="pt-3"
                              outlined
                              dense
                              type="number"
                              v-model="payable.paid_amount"
                              disabled
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              class="pt-3"
                              outlined
                              dense
                              type="number"
                              v-model="payable.amount"
                              :rules="[maxRules(payable.required_amount)]"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-btn v-if="data.payables.length > 1" text @click="removePayable(i)">
                              <v-icon color="red darken-1">mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-btn v-if="data.payables.length == i+1" text @click="addPayable">
                              <v-icon color="green darken-1">mdi-plus-circle</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </v-col>
              </template>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="save"
            :disabled="!data.valid"
          >
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Payment `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { usePayment } from "./composables/payment";

export default defineComponent({
  name: "Payment",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      addPayable,
      removePayable,
      setPayableItems,
      setAmount,
      maxRules,
      payableHeader,
    } = usePayment();

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      addPayable,
      removePayable,
      setPayableItems,
      setAmount,
      maxRules,
      payableHeader,
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
</style>
