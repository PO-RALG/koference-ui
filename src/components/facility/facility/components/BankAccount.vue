<template>
  <div class="bank-accounts">
    <v-card-actions class="pa-5">
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
    <v-card class="pb-8">
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        :single-expand="true"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
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
                @click="openConfirmDialog(item.id)"
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
                    required
                    outlined
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
          <v-btn color="red darken-1" text @click="closeDialog">Cancel</v-btn>
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
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    data: {
      required: true,
    },
    bankName: {
      required: true,
    },
  },

  setup(_props, context) {
    const openDialog = (item = null) => {
      context.emit("onOpenDialog", item);
    };

    const closeDialog = () => {
      context.emit("onCloseDialog");
    };

    const openConfirmDialog = (id) => {
      context.emit("onOpenConfirmDialog", id);
    };

    const cancelConfirmDialog = () => {
      context.emit("onCloseConfirmDialog");
    };

    const save = () => {
      context.emit("onCreate");
    };

    const remove = () => {
      context.emit("onRemove");
    };

    return {
      openDialog,
      closeDialog,
      openConfirmDialog,
      cancelConfirmDialog,
      save,
      remove,
    };
  },
});
</script>
