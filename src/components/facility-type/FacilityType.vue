<template>
  <div class="Facility Type">
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

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
          <v-icon @click="openConfirmDialog(item.id)"> mdi-trash-can-outline </v-icon>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>

    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Facility Type`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field v-model="data.formData.name" label="Name" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="data.formData.code" label="Code" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="data.formData.cost_center" label="Cost center" required></v-text-field>
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
        <ModalHeader :title="`Delete Facility Type `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";
import { FacilityType } from "./types/FacilityType";
import store from "@/store";
import { defineComponent, reactive, watch, onMounted, computed } from "@vue/composition-api";

import { get, create, update, destroy, search } from "./services/facility-types.service";

export default defineComponent({
  name: "FacilityType",
  setup() {
    let dataItems: Array<FacilityType> = [];
    let facilityTypeData: FacilityType;

    let data = reactive({
      title: "Manage Facility Types",
      valid: true,
      isOpen: false,
      node: null,
      response: {},
      modalTitle: "",
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Code", align: "start", sortable: false, value: "code" },

        {
          text: "Cost Center",
          align: "start",
          sortable: false,
          value: "cost_center",
        },

        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: facilityTypeData,
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
    });

    onMounted(() => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = {
          from,
          to,
          total,
          current_page,
          per_page,
          last_page,
        };
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
      });
    });

    computed(() => {
      return "test";
    });

    const searchCategory = (categoryName) => {
      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
          console.log("response data", response.data.data);
          data.items = response.data.data.data;
        });
      }
    };

    const reloadData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    };

    const openConfirmDialog = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };
    const getFacilityTypes = () => {
      get(data).then((response) => {
        console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as FacilityType;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as FacilityType;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        data.deletemodal = false;
      });
    };

    const save = () => {
      if (data.formData.id) {
        updateFacilityType(data.formData);
      } else {
        createUser(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as FacilityType;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateFacilityType = (data: any) => {
      update(data).then((response) => {
        cancelDialog();
      });
    };

    const createUser = (data: any) => {
      create(data).then((response) => {
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

    return {
      data,
      openDialog,
      getData,
      cancelDialog,
      openConfirmDialog,
      getFacilityTypes,
      updateFacilityType,
      save,
      remove,
      cancelConfirmDialog,
      searchCategory,
    };
  },
});
</script>

<style scoped></style>
