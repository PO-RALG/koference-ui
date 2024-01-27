<template>
  <div class="user">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn v-if="can('create', 'User')" color="" @click="openTrushedDialog">
        <v-icon>mdi-delete-empty-outline</v-icon>
        Restore Trashed Users
      </v-btn>
      <v-btn large color="teal" class="white--text" @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table :headers="data.headers" :items="users" class="elevation-1">
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
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-switch
                v-bind="attrs"
                v-on="on"
                :input-value="item.active"
                @click.native.stop
                v-model="item.active"
                @change="openActivationDialog(item)"
                :disabled="item.id === data.currentUser.id"
              ></v-switch>
            </template>
            <span>Role and Menu Management</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <!-- <v-tooltip top>
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
          </v-tooltip> -->

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                :disabled="item.id === data.currentUser.id"
                class="mr-2"
                @click="openDialog(item)"
              >
                mdi-pencil-box-outline
              </v-icon>
            </template>
            <span>Upate</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="openDialogMapRoles(item)"
              >
                mdi-account-lock
              </v-icon>
            </template>
            <span>Role and Menu Management</span>
          </v-tooltip>

          <!-- <v-icon
            @click="openConfirmDialog(item)"
            :disabled="
              cant('delete', 'User') || item.id === data.currentUser.id
            "
          >
            mdi-trash-can-outline
          </v-icon> -->
        </template>
        <!-- <template v-slot:footer>
          <Paginate
            :params="data.response"
            :rows="data.rows"
            @onPageChange="getData"
          />
        </template> -->
      </v-data-table>
    </v-card>
    <UserForm
      :isOpen="data.modal"
      :title="data.modalTitle"
      :formData="data.formData"
      @onSubmit="save"
      @onClose="cancelDialog"
    />
    <RoleForm
      :isOpen="data.roleModal"
      :userObject="data.userObject"
      :title="data.modalTitle"
      :formData="data.formData"
      @onSubmit="saveUserRoles"
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

    <Modal :modal="data.trushModal" :width="1200">
      <template v-slot:header>
        <ModalHeader :title="`Trashed Users `" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-data-table
            :headers="data.trush_headers"
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
            <template v-slot:top>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-col cols="6" sm="12" md="12" class="pa-0">
                  <v-text-field
                    prepend-inner-icon="mdi-filter-outline"
                    outlined
                    label="Search"
                    @keyup="filterTrushedUser()"
                    :items="data.itemsToFilter"
                    v-model="data.searchTermTrushed"
                    @click:clear="resetSearchText()"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-card-title>
            </template>
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
    <!-- <Modal :modal="data.restoreTrashedmodal" :width="400">
      <template v-slot:header>
        <ModalHeader :title="`Restore Users From Trash `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure you want to restore this? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelRestoreDialog"
            >Cancel</v-btn
          >
          <v-btn color="red darken-1" text @click="restore">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUser } from "./composables/user";
import UserForm from "./forms/UserForm.vue";
import RoleForm from "./forms/RoleForm.vue";

export default defineComponent({
  name: "MainUserComponent",
  components: {
    UserForm,
    RoleForm,
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
      saveUserRoles,
      deleteItem,
      onChangeList,
      status,
      confirmTitle,
      message,
      resetPasswd,
      filterUsers,
      resetSearchText,
      setApprovalRole,
      openTrushedDialog,
      cancelConfirmDialog,
      trushedNew,
      cancelRestoreDialog,
      restore,
      openRestoreTrashedDialog,
      filterTrushedUser,
      openDialogMapRoles,
    } = useUser();

    const showRoles = (roles) => {
      return roles.map((r) => r.name);
    };

    return {
      data,
      message,
      confirmTitle,
      trushedNew,
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
      saveUserRoles,
      deleteItem,
      onChangeList,
      toggleStatus,
      status,
      resetPasswd,
      openApprovalRoleDialog,
      filterUsers,
      resetSearchText,
      setApprovalRole,
      openTrushedDialog,
      cancelConfirmDialog,
      cancelRestoreDialog,
      restore,
      openRestoreTrashedDialog,
      filterTrushedUser,
      openDialogMapRoles,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
