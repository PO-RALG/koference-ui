<template>
  <div class="Facility">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'Facility')"
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

        <!-- <template v-slot:[`item.name`]="{ item }"> -->
        <!--   <span v-html="item.name"></span> -->
        <!-- </template> -->

        <template v-slot:[`item.name`]="{ item }">
          <span
            ><a href="" @click="navigateToFacility($event, item)">{{
              item.name
            }}</a></span
          >
        </template>

        <template v-slot:[`item.active`]="{ item }">
          <v-icon v-if="item.active" medium color="success">mdi-check</v-icon>
          <v-icon v-else medium color="warning">mdi-close</v-icon>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="openDialog(item)"
                :disabled="cant('edit', 'Facility')"
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
                :disabled="cant('delete', 'Facility')"
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
                  <v-select
                    v-model="data.formData.facility_type_id"
                    :items="data.facilityTypes"
                    item-value="id"
                    label="Facility type"
                    required
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.code }} - {{ item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.code }} - {{ item.name }}
                    </template>
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
                <v-col cols="12" md="4">
                  <v-checkbox
                    v-model="data.formData.active"
                    :label="`Active`"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="data.formData.postal_address"
                    label="Postal address"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12" class="hierarchy-container">
                  <v-label v-if="data.formData.location">
                    <h5 class="tree-title">
                      SELECTED USER LOCATION ({{ data.formData.location.name }})
                    </h5>
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
          <v-btn color="green darken-1" text @click="save">
            {{ data.modalTitle }}
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
import { useFacility } from "./composables/facility";

export default defineComponent({
  name: "Facility",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      getFacilityTypeData,
      updateFacility,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      loadLocationChildren,
      getNodes,
      searchFacilityTypes,
      facilities,
      navigateToFacility,
      generateLink,
    } = useFacility();

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
      searchItem,
      getData,
      loadLocationChildren,
      getNodes,
      searchFacilityTypes,
      facilities,
      navigateToFacility,
      generateLink,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
