<template>
  <div class="bank-accounts">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="cant('create', 'BankAccount')"
        color="primary"
        @click="openDialog"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        :single-expand="true"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Bank Name"
                @change="searchCategory($event)"
                :items="bankName"
                :item-text="'fullName'"
                :item-divider="true"
                return-object
                required
                outlined
                clearable
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.startDate`]="{ item }">
          <span>{{ item.startDate }}</span>
        </template>
        <template v-slot:[`item.endDate`]="{ item }">
          <span>{{ item.endDate }}</span>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip :disabled="cant('edit', 'BankAccount')" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :disabled="cant('edit', 'BankAccount')"
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="openDialog(item)"
              >
                mdi-pencil-box-outline
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip :disabled="cant('delete', 'BankAccount')" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :disabled="cant('delete', 'BankAccount')"
                v-bind="attrs"
                v-on="on"
                @click="deleteBankAccount(item.id)"
                >mdi-trash-can-outline</v-icon
              >
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="620">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Bank Account`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.branch"
                    label="Branch"
                    required
                    outlined
                    :hide-details="true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.name"
                    label="Name"
                    required
                    outlined
                    :hide-details="true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.bank"
                    label="Bank"
                    outlined
                    required
                    :hide-details="true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.number"
                    label="Number"
                    required
                    outlined
                    :hide-details="true"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12" class="mb-n8">
                  <v-autocomplete
                    v-model="data.formData.bank_account_type_id"
                    label="Bank Account Type"
                    :items="data.accountTypes"
                    :item-text="'name'"
                    item-value="id"
                    :item-divider="true"
                    required
                    outlined
                    clearable
                  ></v-autocomplete>
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

    <Modal :modal="data.showDeleteDialog" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Bank Accounts`" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="green darken-1" text @click="cancelConfirmDialog"
            >Cancel</v-btn
          >
          <v-btn
            :disabled="cant('delete', 'BankAccount')"
            color="red darken-1"
            text
            @click="remove"
            >Yes</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useBank } from "./composables/bank";

export default defineComponent({
  name: "BackAccount",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      deleteBankAccount,
      updateFinancialYear,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchBankAccounts,
      bankName,
    } = useBank();

    return {
      data,
      openDialog,
      cancelDialog,
      deleteBankAccount,
      updateFinancialYear,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchBankAccounts,
      bankName,
    };
  },
});
</script>

<style scoped></style>
