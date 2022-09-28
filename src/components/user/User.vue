<template>
  <div class="academic-year">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <!-- <v-btn
        v-if="can('create', 'User')"
        color="warning"
        @click="openTrushedDialog"
      >
        <v-icon>mdi-delete-empty-outline</v-icon>
        Trush
      </v-btn> -->
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'User')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="users"
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-text-field
                outlined
                label="Search Users"
                @keyup="filterUsers()"
                :items="data.itemsToFilter"
                v-model="data.searchTerm"
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.displayRoles`]="{ item }">
          <span>{{ item.displayRoles }}</span>
        </template>
        <template v-slot:[`item.activations`]="{ item }">
          <v-switch
            :input-value="item.active"
            @click.native.stop
            v-model="item.active"
            @change="openActivationDialog(item)"
            :disabled="
              cant('activateDeactivate', 'User') ||
              item.id === data.currentUser.id
            "
            value
          >
          </v-switch>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top v-if="canGetApprovalRole(item)">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="openApprovalRoleDialog(item)"
                :disabled="cant('assignApprovalRoles', 'User')"
              >
                mdi-check
              </v-icon>
            </template>
            <span>Assign Approval Role</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="resetPasswd(item)"
                :disabled="cant('edit', 'User')"
              >
                mdi-lock-reset
              </v-icon>
            </template>
            <span>Reset Password</span>
          </v-tooltip>

          <v-icon
            class="mr-2"
            @click="openDialog(item)"
            :disabled="cant('edit', 'User')"
          >
            mdi-pencil-box-outline
          </v-icon>
          <v-icon
            @click="openConfirmDialog(item)"
            :disabled="
              cant('delete', 'User') || item.id === data.currentUser.id
            "
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
    <UserForm
      :isOpen="data.modal"
      :title="data.modalTitle"
      :formData="data.formData"
      @onSubmit="save"
      @onClose="cancelDialog"
    />
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
    <Modal
      v-if="data.showApprovalDialog"
      :modal="data.showApprovalDialog"
      :width="600"
    >
      <template v-slot:header>
        <ModalHeader :title="'Assign Approval Role'" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-text-field
                    label="Name"
                    v-model="data.user.fullName"
                    required
                    disabled
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-autocomplete
                    v-model="data.user.approval_role_id"
                    label="Select Approval Role"
                    :items="data.approvalRoles"
                    :item-text="'name'"
                    item-value="id"
                    outlined
                    small
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter class="mt-n8">
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="setApprovalRole">
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="data.trushModal" :width="1200">
      <template v-slot:header>
        <ModalHeader :title="`Trashed Customers `" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-data-table
            :headers="data.headers"
            :items="trushedNew"
            :single-expand="true"
            class="elevation-0"
            disable-pagination
            hide-default-footer
          >
            <template v-slot: [`item.index`]="{ item }">
              <span>
                {{ item.index }}
              </span>
            </template>
            <!-- <template v-slot:top>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-col cols="6" sm="12" md="12" class="pa-0">
                  <v-text-field
                    prepend-inner-icon="mdi-filter-outline"
                    outlined
                    label="Search"
                    @keyup="filterCustomers()"
                    :items="data.itemsToFilter"
                    v-model="data.searchTerm"
                    @click:clear="resetSearchText()"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-card-title>
            </template> -->
            <template v-slot:[`item.startDate`]="{ item }">
              <span>{{ item.startDate }}</span>
            </template>
            <template v-slot:[`item.endDate`]="{ item }">
              <span>{{ item.endDate }}</span>
            </template>
            <template v-slot:[`item.activations`]="{ item }">
              <v-switch
                disabled
                :input-value="item.active"
                @change="setActivation(item)"
                value
              ></v-switch>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    large
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                    @click="openRestoreTrashedDialog(item)"
                  >
                    mdi-restore
                  </v-icon>
                </template>
                <span>Restore</span>
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
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog"
            >Close</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useUser } from "./composables/user";
import UserForm from "./forms/UserForm.vue";

export default defineComponent({
  components: {
    UserForm,
  },
  setup() {
    const {
      data,
      openApprovalRoleDialog,

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
      filterUsers,
      resetSearchText,
      canGetApprovalRole,
      setApprovalRole,
      openTrushedDialog,
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
      openApprovalRoleDialog,
      filterUsers,
      resetSearchText,
      canGetApprovalRole,
      setApprovalRole,
      openTrushedDialog,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
