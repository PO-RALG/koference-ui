<template>
  <div class="Supplier">
    <Snackbar />

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
              ></v-autocomplete>
            </v-col>
          </v-card-title>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-2"
            @click="openDialog(item)"
            :disabled="cant('edit', 'Supplier')"
          >
            mdi-pencil-box-outline
          </v-icon>
          <v-icon
            @click="openConfirmDialog(item.id)"
            :disabled="cant('delete', 'Supplier')"
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

    <Modal :modal="data.modal" :width="960">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Supplier`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="data.formData.name"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.email"
                    label="Email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.tin"
                    label="TIN"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.phone"
                    label="Phone"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.address"
                    label="Address"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.bank_account_name"
                    label="Bank Account Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    v-model="data.formData.bank_account_number"
                    label="Bank Account Number"
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
          <v-btn color="green darken-1" text @click="save">
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
import { Supplier } from "./types/Supplier";
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import {
  get,
  create,
  update,
  destroy,
  search,
} from "./services/supplier.service";
import { AxiosResponse } from "axios";

export default defineComponent({
  name: "Supplier",
  setup() {
    let dataItems: Array<Supplier> = [];
    let activityData = {} as Supplier;
    
    let data = reactive({
      title: "Suppliers",
      valid: true,
      isOpen: false,
      node: null,
      response: {},
      modalTitle: "",
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Email",
          align: "start",
          sortable: false,
          value: "email",
        },
        {
          text: "TIN",
          align: "start",
          sortable: false,
          value: "tin",
        },
        {
          text: "Phone",
          align: "start",
          sortable: false,
          value: "phone",
        },
        {
          text: "Address",
          align: "start",
          sortable: false,
          value: "address",
        },
        {
          text: "Bank Account Name",
          align: "start",
          sortable: false,
          value: "bank_account_name",
        },
        {
          text: "Bank Account Number",
          align: "start",
          sortable: false,
          value: "bank_account_number",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
        },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: activityData,
      params: {
        total: 100,
        size: 10,
      },
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      searchTerm: "",
    });

    onMounted(() => {
      getTableData();
    });

    const getTableData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
    };

    const searchItem = (itemName) => {
      if (itemName != null) {
        search({ name: itemName.name }).then((response: AxiosResponse) => {
          data.items = response.data.data.data;
        });
      }
    };

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openConfirmDialog = (deleteId: string) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
    };

    const cancelDialog = () => {
      data.formData = {} as Supplier;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as Supplier;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        data.deletemodal = false;
        getTableData();
      });
    };

    const save = () => {
      if (data.formData.id) {
        updateActivity(data.formData);
      } else {
        createActivity(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as Supplier;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateActivity = (data: Supplier) => {
      update(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    const createActivity = (data: Supplier) => {
      create(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateActivity,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
    };
  },
});
</script>

<style scoped></style>
