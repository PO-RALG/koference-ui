<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="cant('create', 'ApprovalRole')">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="entries"
        hide-default-footer
        disable-pagination
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)" :disabled="cant('edit', 'AuthRole')">
            mdi-pencil-box-outline
          </v-icon>
          <v-icon @click="openConfirmDialog(item)" :disabled="cant('delete', 'AuthRole')">
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
        <ModalHeader :title="`${data.modalTitle} Role`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-text-field outlined label="Name" v-model="data.formData.name" required> </v-text-field>
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="12" class="mt-n8">
                  <v-text-field outlined label="Description" v-model="data.formData.description" required> </v-text-field>
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="12" class="mt-n8">
                  <fetcher :api="'/api/v1/admin-area-levels'">
                  <div slot-scope="{ json: levels, loading }">
                    <div v-if="loading">Loading...</div>
                    <v-autocomplete
                      v-else
                      v-model="data.formData.level_id"
                      label="Select Approval Role Level"
                      :items="levels"
                      :item-text="'name'"
                      item-value="id"
                      outlined
                      small>
                    </v-autocomplete>
                  </div>
                  </fetcher>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter class="mt-n8">
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
      :message="'Are you sure you want to delete this role?'"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="'Delete Role'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useApprovalRole } from "./composables/use-approval-role";

export default defineComponent({
  setup() {
    const {
      data,
      entries,
      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      getData,
      updateRole,
      save,
      deleteItem,
    } = useApprovalRole();

    return {
      data,
      entries,
      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      getData,
      updateRole,
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
