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
        <template v-slot:[`item.displayRoles`]="{ item }">
          <span>{{ item.displayRoles }}</span>
        </template>
        <template v-slot:[`item.activations`]="{ item }">
          <v-switch
            :input-value="item.active"
            @click.native.stop
            v-model="item.active"
            @change="openActivationDialog(item)"
            :disabled="cant('activateDeactivate', 'User') || item.id === data.currentUser.id"
            value
          >
          </v-switch>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="resetPasswd(item)" :disabled="cant('edit', 'User')">
                mdi-lock-reset
              </v-icon>
            </template>
            <span>Reset Password</span>
          </v-tooltip>

          <v-icon class="mr-2" @click="openDialog(item)" :disabled="cant('edit', 'User')">
            mdi-pencil-box-outline
          </v-icon>
          <v-icon
            @click="openConfirmDialog(item)"
            :disabled="cant('delete', 'User') || item.id === data.currentUser.id"
          >
            mdi-trash-can-outline
          </v-icon>
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
                  <v-text-field
                    label="First Name"
                    v-model="data.formData.first_name"
                    :rules="data.requiredRules"
                    required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field
                    label="Midde Name"
                    v-model="data.formData.middle_name"
                    :rules="data.requiredRules"
                    required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field
                    label="Last Name"
                    v-model="data.formData.last_name"
                    :rules="data.requiredRules"
                    required> </v-text-field>
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
                  <v-text-field
                    label="Check Number"
                    v-model="data.formData.check_number"
                    :rules="data.requiredRules"
                    required> </v-text-field>
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
                    :current-item="data.currentItem"
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
              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                  <DualMultiSelect
                    :source="data.roles"
                    :destination="data.selectedRoles"
                    v-model="data.formData.roles"
                    :label="'name'"
                    :modelName="'roles'"
                    @onChangeList="onChangeList"
                  />
                </v-col>
              </v-row>
            </v-container>
            <!--<pre>{{ data.formData }}</pre>-->
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save" :disabled="!data.valid">
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
    <ConfirmDialog
      @rejectFunction="closeConfirmDialog"
      @acceptFunction="deleteItem"
      :message="message"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="`Delete User`"
    />
    <ConfirmDialog
      @rejectFunction="closeActivationDialog"
      @acceptFunction="toggleStatus"
      :message="message"
      :data="data.item"
      :isOpen="data.show"
      :title="`${data.status} User`"
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
      closeActivationDialog,
      openConfirmDialog,
      openActivationDialog,
      filterRoles,
      toggleStatus,
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
      onChangeList,
      status,
      confirmTitle,
      message,
      resetPasswd,
    } = useUser();

    const showRoles = (roles) => {
      return roles.map((r) => r.name);
    };

    return {
      data,
      message,
      confirmTitle,

      showRoles,
      openDialog,
      cancelDialog,
      closeConfirmDialog,
      closeActivationDialog,
      openConfirmDialog,
      openActivationDialog,
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
      onChangeList,
      toggleStatus,
      status,
      resetPasswd,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
