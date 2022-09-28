<template>
  <div class="customers">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <!-- <v-btn
        v-if="can('create', 'Customer')"
        color="primary"
        @click="openDialog"
      >
        <v-icon>mdi-delete-variant</v-icon>
      </v-btn> -->
      <v-btn
        v-if="can('create', 'Customer')"
        color="warning"
        @click="openTrushedDialog"
      >
        <v-icon>mdi-delete-empty-outline</v-icon>
        Restore deleted customers
      </v-btn>
      <v-btn
        v-if="can('create', 'Customer')"
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
        disable-pagination
        hide-default-footer
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-text-field
                prepend-inner-icon="mdi-filter-outline"
                outlined
                label="Enter Filter Term"
                @keyup="filterCustomers()"
                :items="data.itemsToFilter"
                v-model="data.searchTerm"
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.startDate`]="{ item }">
          <span>{{ item.startDate }}</span>
        </template>
        <template v-slot:[`item.endDate`]="{ item }">
          <span>{{ item.endDate }}</span>
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
              >
                mdi-pencil-box-outline
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="deleteCustomer(item.id)"
                >mdi-trash-can-outline</v-icon
              >
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
    <Modal :modal="data.modal" :width="700">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Customers`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" :md="data.modalTitle == 'Update' ? 12 : 9">
                  <v-autocomplete
                    v-if="!data.addcustomer && data.modalTitle != 'Update'"
                    :items="data.genericCustomer"
                    item-text="name"
                    item-value="name"
                    v-model="data.formData.name"
                    outlined
                    dense
                    label="Select Generic Costomer"
                    hide-details
                    return-object
                    @change="populateFormData($event)"
                  ></v-autocomplete>
                  <v-text-field
                    v-if="data.addcustomer || data.modalTitle == 'Update'"
                    v-model="data.formData.name"
                    label="Name"
                    required
                    outlined
                    hide-details
                    dense
                  ></v-text-field>
                  <!-- :disabled="isUpdate" -->
                </v-col>
                <v-col v-if="data.modalTitle != 'Update'" cols="1" md="1">
                  <v-btn
                    v-if="!data.addcustomer"
                    @click="setAddCostomerValue()"
                    color="primary"
                    ><v-icon> mdi-plus </v-icon>
                    Custom
                  </v-btn>
                  <v-btn
                    v-if="data.addcustomer"
                    @click="setGenericValue()"
                    color="warning"
                    ><v-icon> mdi-plus </v-icon>
                    Generic
                  </v-btn>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.email"
                    label="Email"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.phone"
                    outlined
                    required
                    label="Phone"
                    v-mask="'#### ### ###'"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" class="mt-n8">
                  <v-text-field
                    v-model="data.formData.address"
                    label="Address"
                    required
                    outlined
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
          <v-btn color="blue darken-1" text @click="save"
            >{{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Customers `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelConfirmDialog"
            >Cancel</v-btn
          >
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="data.restoreTrashedmodal" :width="400">
      <template v-slot:header>
        <ModalHeader :title="`Restore Customers From Trash `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure you want to restore this? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelRestoreDialog"
            >Cancel</v-btn
          >
          <v-btn color="red darken-1" text @click="restore">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="data.trushModal" :width="1200">
      <template v-slot:header>
        <ModalHeader :title="`Trashed Customers `" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-data-table
            :headers="data.headersTrash"
            :items="trushedNew"
            :single-expand="true"
            class="elevation-0"
            disable-pagination
            hide-default-footer
          >
            <template v-slot: [`item.index`]="{ item }">
              <span>
                {{ item.index }}
              </span>
            </template>
            <!-- <template v-slot:top>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-col cols="6" sm="12" md="12" class="pa-0">
                  <v-text-field
                    prepend-inner-icon="mdi-filter-outline"
                    outlined
                    label="Search"
                    @keyup="filterCustomers()"
                    :items="data.itemsToFilter"
                    v-model="data.searchTerm"
                    @click:clear="resetSearchText()"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-card-title>
            </template> -->
            <template v-slot:[`item.startDate`]="{ item }">
              <span>{{ item.startDate }}</span>
            </template>
            <template v-slot:[`item.endDate`]="{ item }">
              <span>{{ item.endDate }}</span>
            </template>
            <template v-slot:[`item.activations`]="{ item }">
              <v-switch
                disabled
                :input-value="item.active"
                @change="setActivation(item)"
                value
              ></v-switch>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    large
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                    @click="openRestoreTrashedDialog(item)"
                  >
                    mdi-restore
                  </v-icon>
                </template>
                <span>Restore</span>
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
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog"
            >Close</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

import { useCustomer } from "./composables/customer";

export default defineComponent({
  name: "Customer",
  setup() {
    const {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteCustomer,
      openRestoreTrashedDialog,
      getCustomer,
      updatecustomer,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      setActivation,
      setAddCostomerValue,
      setGenericValue,
      populateFormData,
      isUpdate,
      filterCustomers,
      resetSearchText,
      openTrushedDialog,
      cancelRestoreDialog,
      restore,
      trushedNew,
    } = useCustomer();

    return {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteCustomer,
      openRestoreTrashedDialog,
      getCustomer,
      updatecustomer,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      setActivation,
      setAddCostomerValue,
      setGenericValue,
      populateFormData,
      isUpdate,
      filterCustomers,
      resetSearchText,
      openTrushedDialog,
      cancelRestoreDialog,
      restore,
      trushedNew,
    };
  },
});
</script>

<style scoped></style>
