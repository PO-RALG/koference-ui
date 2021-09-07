<template>
  <div class="Facility">
    <Snackbar />

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

        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
          <v-icon @click="openConfirmDialog(item.id)"> mdi-trash-can-outline </v-icon>
        </template>
      </v-data-table>
      <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
    </v-card>
    
    <Modal :modal="data.modal" :width="760">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Facility`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.name"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.code"
                    label="Code"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="data.formData.facility_type_id"
                    :items="data.facilityTypes"
                    item-text="name"
                    item-value="id"
                    label="Facility type"
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="data.formData.location_id"
                    :items="data.adminAreas"
                    item-text="name"
                    item-value="id"
                    label="Location"
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.phone_number"
                    label="Phone number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.email"
                    label="Email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="data.formData.postal_address"
                    label="Postal address"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-checkbox
                    v-model="data.formData.active"
                    :label="`Active`"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save"
            >{{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Facility `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelConfirmDialog"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Facility } from "./types/Facility";
import { FacilityType } from "../facilitytype/types/FacilityType";
import { AdminArea } from "../admin-area/admin-area/types/AdminArea";
import store from "@/store";
import {
  defineComponent,
  reactive,
  watch,
  onMounted,
} from "@vue/composition-api";

import {
  get,
  create,
  update,
  destroy,
  search,
} from "./services/facility.service";
import { get as getFT } from "../facilitytype/services/facility-types.service";
import { get as getAdminArea } from "@/components/admin-area/admin-area/services/admin-area-services";
import { AxiosResponse } from "axios";

export default defineComponent({
  name: "Facility",
  setup() {
    let dataItems: Array<Facility> = [];
    let facilityTypes: Array<FacilityType> = [];
    let adminAreas: Array<AdminArea> = [];
    let facilityData: Facility;

    let data = reactive({
      title: "Manage Facilities",
      valid: true,
      isOpen: false,
      node: null,
      response: {},
      modalTitle: "",
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Code", align: "start", sortable: false, value: "code" },

        {text: "Phone number",align: "start",sortable: false,value: "phone_number"},
        {text: "Email",align: "start",sortable: false,value: "email"},
        {text: "Postal address",align: "start",sortable: false,value: "postal_address"},
        {text: "Facility type",align: "start",sortable: false,value: "facility_type.name"},
        {text: "Location",align: "start",sortable: false,value: "location.name"},
        {text: "Active",align: "start",sortable: false,value: "active"},

        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      facilityTypes: facilityTypes,
      itemsToFilter: [],
      formData: facilityData,
      params: {
        total: 100,
        size: 10,
      },
      rows: ["5", "10", "15"],
      itemtodelete: "",
      adminAreas: adminAreas,
    });

    onMounted(() => {
      get({per_page:10}).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page,  last_page } = response.data.data
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
        data.response = {from, to, total, current_page, per_page, last_page};
      });
      getFacilityType();
      getAdminstrativeArea();
    });

    const searchCategory = (categoryName) => {

      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
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

    const openConfirmDialog = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };
    const getFacilityType = () => {
      getFT({per_page:10}).then((response: AxiosResponse) => {
        data.facilityTypes = response.data.data.data;
      });
    };

    const getAdminstrativeArea = () => {
      getAdminArea({per_page:10}).then((response: AxiosResponse) => {
        data.adminAreas = response.data.data.data;
      });
    };
    
    const cancelDialog = () => {
      data.formData = {} as Facility;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as Facility;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        data.deletemodal = false;
      });
    };

    const save = () => {
      if (data.formData.id) {
        updateFacility(data.formData);
      } else {
        createFacility(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as Facility;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateFacility = (data: any) => {
      update(data).then((response) => {
        cancelDialog();
      });
    };

    const createFacility = (data: any) => {
      create(data).then((response) => {
        cancelDialog();
      });
    };
    // watching a getter

    watch(
      () => store.state.snackbar,
      () => {
      }
    );

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      getFacilityType,
      updateFacility,
      save,
      remove,
      cancelConfirmDialog,
      searchCategory,
      getData,
    };
  },
});
</script>

<style scoped></style>
