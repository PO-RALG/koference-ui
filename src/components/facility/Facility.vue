<template>
  <div class="Facility">
    <Snackbar />

    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="cant('create', 'Facility')">
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

        <template v-slot[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)" :disabled="cant('edit', 'Facility')">
            mdi-pencil-box-outline
          </v-icon>
          <v-icon @click="openConfirmDialog(item.id)" :disabled="cant('delete', 'Facility')">
            mdi-trash-can-outline
          </v-icon>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
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
                  <v-text-field v-model="data.formData.name" label="Name" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="data.formData.code" label="Code" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="data.formData.facility_type_id"
                    :items="data.facilityTypes"
                    item-value="id"
                    label="Facility type"
                    required
                  >
                    <template v-slot:selection="{ item }"> {{ item.code }} - {{ item.name }} </template>
                    <template v-slot:item="{ item }"> {{ item.code }} - {{ item.name }} </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            v-model="data.searchTerm"
                            placeholder="Search"
                            @input="searchFacilityTypes"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="data.formData.phone_number" label="Phone number"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="data.formData.email" label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-checkbox v-model="data.formData.active" :label="`Active`"></v-checkbox>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field v-model="data.formData.postal_address" label="Postal address"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12" class="hierarchy-container">
                  <v-label v-if="data.formData.location">
                    <h5 class="tree-title">SELECTED USER LOCATION ({{ data.formData.location.name }})</h5>
                  </v-label>
                  <v-label v-else>
                    <h5 class="tree-title">SELECT USER LOCATION</h5>
                  </v-label>
                  <TreeBrowser
                    v-if="data.node"
                    @onClick="loadLocationChildren"
                    v-model="data.formData.location"
                    :node="data.node"
                  />
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
        <ModalHeader :title="`Delete Facility `" />
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
import { defineComponent, reactive, set, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";

import { Facility } from "./types/Facility";
import { FacilityType } from "@/components/facility-type/types/FacilityType";
import { AdminArea } from "@/components/admin-area/admin-area/types/AdminArea";
import { get, create, update, destroy, search } from "./services/facility.service";
import { get as getFacilityType } from "@/components/facility-type/services/facility-types.service";
import { getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";

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
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Code",
          align: "start",
          sortable: false,
          value: "code",
        },
        {
          text: "Phone number",
          align: "start",
          sortable: false,
          value: "phone_number",
        },
        {
          text: "Email",
          align: "start",
          sortable: false,
          value: "email",
        },
        {
          text: "Postal address",
          align: "start",
          sortable: false,
          value: "postal_address",
        },
        {
          text: "Facility type",
          align: "start",
          sortable: false,
          value: "facility_type.name",
        },
        {
          text: "Location",
          align: "start",
          sortable: false,
          value: "location.name",
        },
        {
          text: "Active",
          align: "start",
          sortable: false,
          value: "active",
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
      facilityTypes: facilityTypes,
      itemsToFilter: [],
      formData: facilityData,
      params: {
        total: 100,
        size: 10,
      },
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      adminAreas: adminAreas,
      searchTerm: "",
    });

    onMounted(() => {
      getTableData();
      getNodes();
    });

    const getTableData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
    };

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
    };

    const getFacilityTypeData = () => {
      getFacilityType({ per_page: 10 }).then((response: AxiosResponse) => {
        data.facilityTypes = response.data.data.data;
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
        getTableData();
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
        data.searchTerm = "";
        searchFacilityTypes(formData.facility_type.code);
      } else {
        data.formData = {} as Facility;
        data.modalTitle = "Create";
        data.searchTerm = "";
        getFacilityTypeData();
      }
      data.modal = !data.modal;
    };

    const updateFacility = (data: any) => {
      update(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    const createFacility = (data: any) => {
      create(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    const loadLocationChildren = (location: any) => {
      data.formData.location_id = location.id;
      if (!location.children) {
        if (location.id !== data.node.id) {
          getChildren(location.id).then((response: AxiosResponse) => {
            if (response.data.data.children.length) {
              set(location, "children", response.data.data.children);
            }
          });
        }
      }
    };

    const getNodes = (id?: number | string) => {
      getChildren(id).then((response: AxiosResponse) => {
        data.node = response.data.data;
      });
    };

    const searchFacilityTypes = (item) => {
      let regSearchTerm = item ? item : data.searchTerm;
      getFacilityType({ per_page: 10, regSearch: regSearchTerm }).then((response: AxiosResponse) => {
        data.facilityTypes = response.data.data.data;
      });
    };

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      getFacilityTypeData,
      updateFacility,
      save,
      remove,
      cancelConfirmDialog,
      searchCategory,
      getData,
      loadLocationChildren,
      getNodes,
      searchFacilityTypes,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
