<template>
  <div class="ChequeList">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'ChequeList')"
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
          </v-card-title>
        </template>
        <template v-slot:[`item.payments`]="{ item }">
          <span>
            {{ item.payments[0].cheque }}
          </span>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>
        <template v-slot:[`item.bank_account`]="{ item }">
          {{ item.bank_account.number }}({{ item.bank_account.name }})
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="openConfirmDialog(item.id)"
                :disabled="cant('delete', 'ChequeList')"
              >
                mdi-trash-can-outline
              </v-icon>
            </template>
            <span>Delete</span>
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

    <Modal :modal="data.modal" :width="1260">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Cheque list`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row class="pa-2 pb-5">
                <v-col cols="12" md="3">
                  <DatePicker
                    :label="'Date'"
                    v-model="data.formData.date"
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
                  <v-btn
                    color="primary"
                    @click="searchPaymentByDate"
                    :disabled="!data.valid"
                  >
                    {{ `Search Payments` }}
                  </v-btn>
                </v-col>
              </v-row>
              <template>
                <v-col cols="12" md="12">
                  <v-data-table
                    :headers="data.paymentHeaders"
                    :items="data.payments"
                    disable-pagination
                    hide-default-footer
                  >
                    <template v-slot:[`item.payment_date`]="{ item }">
                      <span>
                        {{ item.payment_date | format("DD/MM/YYYY") }}
                      </span>
                    </template>
                    <template v-slot:[`item.amount`]="{ item }">
                      {{ item.amount | toCurrency() }}
                    </template>
                    <template v-slot:[`item.bank_account`]="{ item }">
                      {{ item.bank_account.number }}
                      ({{ item.bank_account.name }})
                    </template>
                    <template v-slot:[`item.activations`]="{ item }">
                      <v-checkbox v-model="item.active"></v-checkbox>
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
        <ModalHeader :title="`Delete Cheque List `" />
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
import { useChequeList } from "./composables/cheque-list";

export default defineComponent({
  name: "Creditor",
  setup() {
    const {
      data,
      searchItem,
      getData,
      openDialog,
      cancelDialog,
      save,
      searchPaymentByDate,
      openConfirmDialog,
      cancelConfirmDialog,
      remove,
    } = useChequeList();

    return {
      data,
      searchItem,
      getData,
      openDialog,
      cancelDialog,
      save,
      searchPaymentByDate,
      openConfirmDialog,
      cancelConfirmDialog,
      remove,
    };
  },
});
</script>

<style lang="scss"></style>
