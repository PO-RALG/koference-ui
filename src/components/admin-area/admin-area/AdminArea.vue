<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="cant('update', 'AdminArea')"
        color="primary"
        @click="pullAdminAreasFromPlanRep"
      >
        <v-icon>mdi-sync</v-icon>
        Admin Areas From PlanRep
      </v-btn>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="can('create', 'AdminArea')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table
        :headers="HEADERS"
        :items="data.items"
        hide-default-footer
        disable-pagination
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="mr-2"
            @click="openDialog(item)"
            :disabled="cant('edit', 'AdminArea')"
          >
            mdi-pencil-box-outline
          </v-icon>
          <v-icon
            @click="openConfirmDialog(item)"
            :disabled="cant('delete', 'AdminArea')"
          >
            mdi-trash-can-outline
          </v-icon>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Admin Area`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field
                    label="Name"
                    v-model="data.formData.name"
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field
                    label="Slug"
                    v-model="data.formData.code"
                    outlined
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n8">
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-label><h5>SELECT LOCATION LEVEL</h5></v-label>
                  <v-radio-group
                    row
                    v-model="data.formData.level_id"
                    :mandatory="true"
                  >
                    <v-radio
                      v-for="row in data.levels"
                      :key="row.id"
                      :label="row.name"
                      :value="row.id"
                      @change="setLevel(row.id)"
                    >
                    </v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-col cols="12" sm="12" md="12" class="hierarchy-container">
                <v-label v-if="data.formData.parent">
                  <h5 class="tree-title">
                    SELECTED ADMIN AREA PARENT ({{ data.formData.parent.name }})
                  </h5>
                </v-label>
                <v-label v-else>
                  <h5 class="tree-title">SELECT ADMIN AREA PARENT</h5>
                </v-label>
                <TreeBrowser
                  v-if="data.node"
                  @onClick="loadLocationChildren"
                  :node="data.node"
                  :currentItem="data.currentItem"
                />
              </v-col>
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
      :message="'Are you sure you want to delete this level?'"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="'Delete AdminArea'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userAdmiArea } from "./composables/admin-area";

export default defineComponent({
  setup() {
    const {
      HEADERS,
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      getData,

      updateArea,
      save,
      deleteItem,

      loadLocationChildren,
      searchLevels,
      getNodes,
      setLevel,
      pullAdminAreasFromPlanRep,

      levels,
    } = userAdmiArea();

    return {
      HEADERS,
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      getData,

      updateArea,
      save,
      deleteItem,

      loadLocationChildren,
      searchLevels,
      getNodes,
      setLevel,

      levels,
      pullAdminAreasFromPlanRep,
    };
  },
});
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 3px;
}
</style>
