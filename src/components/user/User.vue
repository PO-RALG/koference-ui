<template>
  <div class="academic-year">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="cant('create', 'User')">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table :headers="data.headers" :items="users" hide-default-footer class="elevation-1">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)" :disabled="cant('edit', 'User')">
            mdi-pencil-box-outline
          </v-icon>
          <v-icon @click="openConfirmDialog(item)" :disabled="cant('delete', 'User')"> mdi-trash-can-outline </v-icon>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} User`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="First Name" v-model="data.formData.first_name" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="Midde Name" v-model="data.formData.middle_name" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="Last Name" v-model="data.formData.last_name" required> </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                  <v-text-field
                    label="Email Address"
                    v-model="data.formData.email"
                    v-bind:rules="data.emailRules"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                  <v-text-field label="Phone Number" v-model="data.formData.phone_number" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                  <v-text-field label="Check Number" v-model="data.formData.check_number" required> </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                  <DualMultiSelect
                    :items="data.roles"
                    :label="'Filter Roles'"
                    :title="'Add Roles'"
                    :item-name="'name'"
                    :selectedItems="selectedRoles"
                    @filterFunction="filterRoles"
                    v-model="data.selectedRoles"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="6">
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
                <v-col cols="12" sm="12" md="6">
                  <v-row v-if="data.showFacility || data.isFacilityUser" class="mt-n8">
                    <v-col cols="12" sm="12" md="12">
                      <v-checkbox
                        v-model="data.isFacilityUser"
                        label="Is Facility User"
                        @change="loadFacilities"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" class="mt-n8" v-if="data.facilities && data.isFacilityUser">
                      <v-select
                        v-model="data.formData.facility_id"
                        :items="facilities"
                        item-value="id"
                        item-text="label"
                        outlined
                        label="Select Facility"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
            <pre>{{ data.formData }}</pre>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
    <ConfirmDialog
      @rejectFunction="closeConfirmDialog"
      @acceptFunction="deleteItem"
      :message="'Are you sure you want to delete this user?'"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="'Delete User'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useUser } from "./composables/user";

export default defineComponent({
  setup() {
    const {
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      filterRoles,
      selectedRoles,

      loadLocationChildren,
      loadFacilities,
      getNodes,
      getData,
      users,
      facilities,

      updateUser,
      save,
      deleteItem,
    } = useUser();

    return {
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      filterRoles,
      selectedRoles,

      loadLocationChildren,
      loadFacilities,
      getNodes,
      getData,
      users,
      facilities,

      updateUser,
      save,
      deleteItem,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
