<template>
  <div class="Supplier">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'Supplier')"
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
              <v-text-field
                prepend-inner-icon="mdi-filter-outline"
                outlined
                label="Enter Filter Term"
                @keyup="filterSupplier()"
                :items="data.itemsToFilter"
                v-model="data.searchTerm"
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.activations`]="{ item }">
          <v-switch
            :input-value="item.active"
            @change="setActivation(item)"
            value
          ></v-switch>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="openDialog(item)"
                :disabled="cant('edit', 'Supplier')"
              >
                mdi-pencil-box-outline
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="openConfirmDialog(item.id)"
                :disabled="cant('delete', 'Supplier')"
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

    <Modal :modal="data.modal" :width="960">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Supplier`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.name"
                    label="Name"
                    outlined
                    required
                    :rules="data.nameRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.email"
                    label="Email"
                    outlined
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4" sm="12">
                  <v-select
                    v-model="data.formData.supplier_type"
                    :items="data.supplierTypes"
                    label="Select Type"
                    outlined
                    :rules="data.typeRules"
                    required
                  >
                  </v-select>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="12"
                  class="mt-n8"
                  v-if="data.formData.supplier_type === 'Contractor/Supplier'"
                >
                  <v-text-field
                    outlined
                    v-model="data.formData.tin"
                    :rules="data.tinRules"
                    v-bind:focus="data.focus"
                    v-on:focus="data.focus = false"
                    label="TIN"
                    v-mask="'###-###-###'"
                    v
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="12"
                  class="mt-n8"
                  v-if="data.formData.supplier_type === 'Employee'"
                >
                  <v-text-field
                    v-model="data.formData.check_number"
                    :rules="[checkNumberValidate()]"
                    v-bind:focus="data.focus"
                    v-on:focus="data.focus = false"
                    @input="uniqueCheckNumber(data.formData.check_number)"
                    label="Check Number"
                    outlined
                    v-mask="'##########'"
                    :error-messages="data.checkNumberError"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="12"
                  class="mt-n8"
                  v-if="data.formData.supplier_type === 'Others'"
                >
                  <v-text-field
                    v-model="data.formData.id_number"
                    label="ID number"
                    outlined
                    :rules="data.idRules"
                    @input="uniqueIdNumber(data.formData.id_number)"
                    :error-messages="data.idNumberError"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12" class="mt-n8">
                  <v-text-field
                    outlined
                    v-model="data.formData.phone"
                    :rules="data.phoneRules"
                    v-bind:focus="data.focus"
                    v-on:focus="data.focus = false"
                    label="Phone"
                    v-mask="'#### ### ###'"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="mt-n8">
                  <v-text-field
                    v-model="data.formData.address"
                    label="Address"
                    outlined
                    :rules="data.bankAddressNumberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12" class="mt-n8 mb-n8">
                  <v-text-field
                    v-model="data.formData.bank_name"
                    label="Bank Name"
                    outlined
                    :rules="data.bankRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12" class="mt-n8 mb-n8">
                  <v-text-field
                    v-model="data.formData.bank_account_name"
                    label="Bank Account Name"
                    outlined
                    :rules="data.bankAccountNameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12" class="mt-n8 mb-n8">
                  <v-text-field
                    type="number"
                    onkeydown="javascript: return event.keyCode == 69 ? false : true"
                    v-model="data.formData.bank_account_number"
                    label="Bank Account Number"
                    outlined
                    :rules="data.bankAccountNumberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" sm="12" class="pt-6">
                  <v-checkbox
                    v-model="data.formData.ismmama"
                    label="Check if Supplier is used for M MAMA"
                  ></v-checkbox>
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
        <ModalHeader :title="`Delete Supplier `" />
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
import { defineComponent } from "vue";
import { useSupplier } from "./composables/supplier";
import SimpleMask from "@/components/shared/masks/SimpleMask.vue";

export default defineComponent({
  name: "Supplier",
  components: {
    SimpleMask,
  },
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateSupplier,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      setActivation,
      filterSupplier,
      resetSearchText,
      checkNumberValidate,
      uniqueCheckNumber,
      uniqueIdNumber,
    } = useSupplier();

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateSupplier,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      setActivation,
      filterSupplier,
      resetSearchText,
      checkNumberValidate,
      uniqueCheckNumber,
      uniqueIdNumber,
    };
  },
});
</script>

<style scoped></style>
