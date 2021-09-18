<template>
  <div class="Invoice Item Definition">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog">
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
              <v-autocomplete
                label="Filter by Name"
                @change="searchCategory($event)"
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
        <template v-slot:[`item.startDate`]="{ item }">
          <span>{{ item.startDate }}</span>
        </template>
        <template v-slot:[`item.endDate`]="{ item }">
          <span>{{ item.endDate }}</span>
        </template>
        <template v-slot:item.activations="{ item }">
          <v-switch :input-value="item.active" @change="setActivation(item)" value></v-switch>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="deleteInvoiceItemdefinition(item.id)"
                >mdi-trash-can-outline</v-icon
              >
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="760">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Invoice Item Definition`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="data.formData.name" label="Name" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="data.formData.code" label="Code" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="data.formData.description" label="Description" required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.unit_of_measure"
                    label="Unit of measures"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="data.formData.gfs_code_id"
                    label="Gfs Codes"
                    :items="data.gfscodes"
                    :item-text="'code'"
                    item-value="id"
                    :item-divider="true"
                    required
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="data.formData.funding_source_id"
                    label="Funding Sources"
                    :items="data.fundingsources"
                    :item-text="'description'"
                    item-value="id"
                    :item-divider="true"
                    required
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
          <v-btn color="blue darken-1" text @click="save">{{ data.modalTitle }} </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Invoice Item Definition `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelConfirmDialog">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";
import { ManageInvoiceItemDefinition } from "./types/";
import store from "@/store";
import { defineComponent, reactive, watch, onMounted, computed } from "@vue/composition-api";

import { get, create, update, destroy, search, activation } from "./services/invoice-item-definition";
import { allgfscodes } from "../../setup/gfs-code/service/gfs.service";
import { fundingsources } from "../../setup/funding-source/services/funding-sources";

export default defineComponent({
  name: "ManageInvoiceItemDefinition",
  setup() {
    let dataItems: Array<ManageInvoiceItemDefinition> = [];
    let customerData: ManageInvoiceItemDefinition;

    let data = reactive({
      title: "Manage Invoice Item Definition",
      modalTitle: "",
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        {
          text: "Unit of Measure",
          align: "start",
          sortable: false,
          value: "unit_of_measure",
        },
        { text: "Code", align: "start", sortable: false, value: "code" },

        {
          text: "Description",
          align: "start",
          sortable: false,
          value: "description",
        },
        { text: "Fund Source", value: "fund_source.code", sortable: true },
        { text: "Gfs Code", value: "gfs_code.code", sortable: true },
        { text: "Activation", value: "activations", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: customerData,
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      response: {},
      gfscodes: [],
      fundingsources: [],
    });

    onMounted(() => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
      });
      allgfscodes({ per_page: 2000 }).then((response: any) => {
        console.log("gfs codes", response.data);
        data.gfscodes = response.data.data.data;
      });
      fundingsources({ per_page: 2000 }).then((response: any) => {
        console.log("gfs codes", response.data);
        data.fundingsources = response.data.data.data;
      });
    });
    const setActivation = (item) => {
      activation(item).then((response: any) => {
        console.log("activated data", response.data);
        reloadData();
      });
    };
    computed(() => {
      return "test";
    });

    const searchCategory = (categoryName) => {
      console.log("argument", categoryName);

      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
          console.log("response data", response.data.data);
          data.items = response.data.data;
        });
      } else {
        reloadData();
      }
    };

    const reloadData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    };

    const deleteInvoiceItemdefinition = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };
    const getInvoiceItemdefinition = () => {
      get(data).then((response) => {
        console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as ManageInvoiceItemDefinition;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as ManageInvoiceItemDefinition;
      data.deletemodal = false;
    };

    const remove = () => {
      console.log("delete data with id", data.itemtodelete);
      destroy(data.itemtodelete).then(() => {
        reloadData();
        data.deletemodal = false;
      });
    };

    const save = () => {
      console.log("Form Data", data.formData);
      if (data.formData.id) {
        updateInvoiceItemDefinition(data.formData);
      } else {
        createCustomer(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as ManageInvoiceItemDefinition;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateInvoiceItemDefinition = (data: any) => {
      update(data).then((response) => {
        console.log("Updated data", response.data);
        reloadData();
        cancelDialog();
      });
    };

    const createCustomer = (data: any) => {
      create(data).then((response) => {
        console.log("Created data", response.data);
        reloadData();
        cancelDialog();
      });
    };

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };
    // watching a getter

    watch(
      () => store.state.snackbar,
      () => {
        console.log("datazzzzz", store.getters.getSnackBar);
      }
    );

    return {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteInvoiceItemdefinition,
      getInvoiceItemdefinition,
      updateInvoiceItemDefinition,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      setActivation,
    };
  },
});
</script>

<style scoped></style>
