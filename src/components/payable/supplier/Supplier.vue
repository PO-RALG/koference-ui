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
              <v-autocomplete
                label="Filter by Name"
                @change="searchItem($event)"
                :items="data.itemsToFilter"
                :item-text="'name'"
                :item-divider="true"
                return-object
                required
                clearable
                outlined
              ></v-autocomplete>
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
        <ModalBody v-if="data.formData" class="pa-5">
          <v-form v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.name"
                    label="Name"
                    required
                    outlined
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
                    required
                    outlined
                  >
                  </v-select>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="12"
                  v-if="data.formData.supplier_type === 'Contractor'"
                >
                  <v-text-field-simplemask
                    outlined
                    v-model="data.formData.tin"
                    :rules="data.tinRules"
                    :properties="{
                      prefix: '',
                      suffix: '',
                      readonly: false,
                      disabled: false,
                      outlined: false,
                      placeholder: '',
                    }"
                    :options="{
                      inputMask: '###-###-###',
                      outputMask: '#########',
                      empty: null,
                      applyAfter: false,
                      alphanumeric: true,
                      lowerCase: false,
                    }"
                    v-bind:focus="data.focus"
                    v-on:focus="data.focus = false"
                    label="TIN"
                    outlined
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="12"
                  v-if="data.formData.supplier_type === 'Employee'"
                >
                  <v-text-field-simplemask
                    v-model="data.formData.check_number"
                    outlined
                    :rules="data.checkRules"
                    :properties="{
                      prefix: '',
                      suffix: '',
                      readonly: false,
                      disabled: false,
                      outlined: false,
                      placeholder: '',
                    }"
                    :options="{
                      inputMask: '#########',
                      outputMask: '#########',
                      empty: null,
                      applyAfter: false,
                      alphanumeric: false,
                      lowerCase: false,
                    }"
                    v-bind:focus="data.focus"
                    v-on:focus="data.focus = false"
                    label="Check Number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="12"
                  v-if="data.formData.supplier_type === 'Others'"
                >
                  <v-text-field
                    v-model="data.formData.id_number"
                    label="ID number"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field-simplemask
                    v-model="data.formData.phone"
                    :rules="data.phoneRules"
                    :properties="{
                      prefix: '',
                      suffix: '',
                      readonly: false,
                      disabled: false,
                      outlined: false,
                      placeholder: '',
                    }"
                    :options="{
                      inputMask: '#### ### ###',
                      outputMask: '##########',
                      empty: null,
                      applyAfter: false,
                      alphanumeric: false,
                      lowerCase: false,
                    }"
                    v-bind:focus="data.focus"
                    v-on:focus="data.focus = false"
                    label="Phone"
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.address"
                    label="Address"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.bank_name"
                    label="Bank Name"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.bank_account_name"
                    outlined
                    label="Bank Account Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    outlined
                    v-model="data.formData.bank_account_number"
                    label="Bank Account Number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <!--<pre>{{ data.formData }}</pre>-->
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
import { defineComponent } from "@vue/composition-api";
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
    };
  },
});
</script>

<style scoped></style>
