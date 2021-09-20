<template>
  <div class="Invoice">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        Create Invoice
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
        :loading="data.loading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter By Invoice Number"
                @change="searchCategory($event)"
                :items="data.itemsToFilter"
                :item-text="'invoice_number'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.invoice_number`]="{ item }">
          <v-list-item exact light @click="previewInvoice(item)">{{ item.invoice_number }}</v-list-item>
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
    <Modal :modal="data.modal" :width="860">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Invoice`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row class="mt-n8 pa-5">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="data.formData.customer_id"
                    label="Select Customer"
                    :items="data.customers"
                    :item-text="'name'"
                    item-value="id"
                    hide-details
                    small
                  ></v-autocomplete>
                </v-col>
                <v-col class="pt-6" cols="12" md="6">
                  <DatePicker :label="'Ivoice Date'" v-model="data.formData.date" />
                </v-col>
                <v-row class="mt-n8 pa-3" text-center v-for="(invoice, index) in data.invoice_items" :key="index">
                  <v-col cols="4" lg="6" md="6" sm="12">
                    <v-select
                      :items="data.itemdefinitions"
                      :item-text="'name'"
                      v-model="invoice.invoice_item_definition_id"
                      :name="`data.invoice_items[${index}][invoice_item_definition_id]`"
                      label="Select Ivoice Item"
                      item-value="id"
                    ></v-select>
                  </v-col>

                  <v-col cols="4" lg="4" md="4" sm="12">
                    <!-- :rules="formValidation.streamNameRules"-->
                    <v-text-field
                      label="Add Amount"
                      v-model="invoice.amount"
                      :name="`data.invoice_items[${index}][name]`"
                    ></v-text-field>
                  </v-col>

                  <v-col col="3" lg="1" class="d-flex pt-7 pr-12">
                    <v-btn color="blue darken-1" text @click="addRow" v-if="index == data.invoice_items.length - 1">
                      <v-icon small color="success"> mdi-plus-circle </v-icon>
                    </v-btn>

                    <v-btn
                      color="blue darken-1"
                      text
                      v-if="index || (!index && data.invoice_items.length > 1)"
                      @click="removeRow(index)"
                    >
                      <v-icon small color="red"> mdi-minus-circle </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="save">{{ data.modalTitle }} </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Invoice `" />
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
import { ManageInvoice } from "./types";
import { defineComponent, reactive, onMounted, computed } from "@vue/composition-api";

import { get, create, update, destroy, search, activation } from "./services/invoice";
import { allgfscodes } from "@/components/coa/gfs-code/service/gfs.service";
import { customers } from "../customer/services/customer.service";
import { itemdefinitions } from "../invoice-item-definition/services/invoice-item-definition";

export default defineComponent({
  name: "ManageInvoice",
  setup() {
    let dataItems: Array<ManageInvoice> = [];
    let customerData: ManageInvoice;

    let data = reactive({
      title: "Manage Invoice",
      modalTitle: "",
      headers: [
        {
          text: "Invoice Number",
          align: "start",
          sortable: false,
          value: "invoice_number",
        },
        {
          text: "Customer",
          align: "start",
          sortable: false,
          value: "customer.name",
        },

        {
          text: "Ammount",
          align: "start",
          sortable: false,
          value: "amount",
        },
        { text: "Date", value: "date", sortable: true },

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
      customers: [],
      itemdefinitions: [],
      invoice_items: [
        {
          invoice_item_definition_id: "",
          amount: "",
        },
      ],
      loading: false,
    });

    onMounted(() => {
      data.loading = true;
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
        data.loading = false;
      });
      allgfscodes({ per_page: 2000 }).then((response: any) => {
        data.gfscodes = response.data.data.data;
      });
      customers({ per_page: 2000 }).then((response: any) => {
        data.customers = response.data.data.data;
      });
      itemdefinitions({ per_page: 2000 }).then((response: any) => {
        data.itemdefinitions = response.data.data.data;
      });
    });
    const setActivation = (item) => {
      activation(item).then((response: any) => {
        reloadData();
      });
    };
    computed(() => {
      return "test";
    });

    const searchCategory = (categoryName) => {
      if (categoryName != null) {
        search({ invoice_number: categoryName.invoice_number }).then((response: any) => {
          data.items = response.data.data.data;
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
      get(data).then((response) => {});
    };

    const cancelDialog = () => {
      data.formData = {} as ManageInvoice;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as ManageInvoice;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        reloadData();
        data.deletemodal = false;
      });
    };

    const save = () => {
      data.formData.items = data.invoice_items;
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
        data.formData = {} as ManageInvoice;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateInvoiceItemDefinition = (data: any) => {
      update(data).then((response) => {
        reloadData();
        cancelDialog();
      });
    };

    const createCustomer = (data: any) => {
      create(data).then((response) => {
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
    const addRow = () => {
      data.invoice_items.push({
        invoice_item_definition_id: "",
        amount: "",
      });
    };

    const removeRow = (index: any) => {
      data.invoice_items.splice(index, 1);
    };

    const previewInvoice = (item: number) => {};

    return {
      data,
      getData,
      addRow,
      removeRow,
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
      previewInvoice,
    };
  },
});
</script>

<style>
.active-class {
  color: red;
}
</style>
