<template>
  <div class="financial-year">
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
        class="elevation-1"
        :single-expand="true"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Name"
                @change="searchFinancialYear($event)"
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
        <template v-slot:[`item.start_date`]="{ item }">
          <span>{{ item.start_date | format }}</span>
        </template>
        <template v-slot:[`item.end_date`]="{ item }">
          <span>{{ item.end_date | format }}</span>
        </template>
        <template v-slot:[`item.activations`]="{ item }">
          <v-switch :input-value="item.active" @change="toggleStatus(item)" value></v-switch>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="deleteFinancialYear(item.id)">mdi-trash-can-outline</v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Financial Year`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field v-model="data.formData.name" label="Financial Year Name" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <DatePicker :label="'Start Date'" v-model="data.formData.start_date" />
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <DatePicker :label="'End Date'" v-model="data.formData.end_date" />
                </v-col>
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
        <ModalHeader :title="`Delete Financial Year `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="green darken-1" text @click="cancelConfirmDialog">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";
import { FinancialYear } from "./types/FinancialYear";
import { defineComponent, reactive, onMounted } from "@vue/composition-api";

import { get, create, update, destroy, startFinancialYear, search } from "./services/financialyear.service";

export default defineComponent({
  name: "FinancialYear",
  setup() {
    let dataItems: Array<FinancialYear> = [];
    let financialYearData: FinancialYear;

    let data = reactive({
      title: "Manage Finacial Years",
      modalTitle: "",
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Start Date", value: "start_date" },
        { text: "End Date", value: "end_date" },
        { text: "Activation", value: "activations", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: financialYearData,
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      response: {},
    });

    onMounted(() => {
      initialize();
    });

    const initialize = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
      });
    };

    const searchFinancialYear = (categoryName) => {
      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
          data.items = response.data.data.data;
        });
      } else {
        reloadData();
      }
    };

    const toggleStatus = (item) => {
      startFinancialYear(item).then((response: any) => {
        if (response.status === 200) {
          reloadData();
        }
      });
    };

    const reloadData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    };

    const deleteFinancialYear = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };

    const getFinancialYear = () => {
      get(data).then((response) => {
        console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as FinancialYear;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as FinancialYear;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        reloadData();
        data.deletemodal = false;
      });
    };

    const save = () => {
      if (data.formData.id) {
        updateFinancialYear(data.formData);
      } else {
        createFinancialYear(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as FinancialYear;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateFinancialYear = (data: any) => {
      update(data).then((response) => {
        if (response.status === 200) {
          reloadData();
          cancelDialog();
        }
      });
    };

    const createFinancialYear = (data: any) => {
      create(data).then((response) => {
        if (response.status === 200) {
          reloadData();
          cancelDialog();
        }
      });
    };

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    return {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteFinancialYear,
      getFinancialYear,
      updateFinancialYear,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      toggleStatus,
      searchFinancialYear,
    };
  },
});
</script>

<style scoped></style>
