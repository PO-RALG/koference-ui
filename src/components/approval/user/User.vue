<template>
  <div class="academic-year">
    <v-card-actions class="pa-0">
      <h2>Manage Approval Users</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('assignApprovalRoles', 'User')"
      >
        <v-icon>mdi-plus</v-icon>
        Assign Role
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.approval_header"
        :items="approvalUsers"
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:[`item.displayRoles`]="{ item }">
          <span>{{ item.displayRoles }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="openConfirmDialog(item)"
                :disabled="cant('edit', 'User')"
              >
                mdi-arrow-top-left-thin-circle-outline
              </v-icon>
            </template>
            <span>Remove Approval Role</span>
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
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="'Assing Approval Role'" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-autocomplete
                    v-model="data.payload.user_id"
                    label="Select User"
                    :items="users"
                    outlined
                    :item-text="
                      (item) =>
                        `${item.first_name} ${item.middle_name} ${item.last_name}`
                    "
                    item-value="id"
                    return-object
                    @change="onUserSelection"
                    small
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                  <v-select
                    v-model="data.payload.role_id"
                    label="Select Role"
                    :items="data.filteredRoles"
                    :item-text="'name'"
                    outlined
                    item-value="id"
                    small
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-container>
            <!--<pre>{{ data.payload }}</pre>-->
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter class="mt-n8">
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="addApprovalRole('CREATE')">
            Save
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
    <ConfirmDialog
      @rejectFunction="closeConfirmDialog"
      @acceptFunction="addApprovalRole('REVOKE')"
      :message="`Are you sure you want to remove role?`"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="`Remove Approval Role`"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useUser } from "@/components/user/composables/user";

export default defineComponent({
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      getData,
      users,
      addApprovalRole,
      openConfirmDialog,
      closeConfirmDialog,

      approvalUsers,
      usersToAssign,
      onUserSelection,
    } = useUser("APPROVAL");

    return {
      data,
      openDialog,
      cancelDialog,
      getData,
      users,
      addApprovalRole,

      approvalUsers,
      usersToAssign,
      onUserSelection,
      openConfirmDialog,
      closeConfirmDialog,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
