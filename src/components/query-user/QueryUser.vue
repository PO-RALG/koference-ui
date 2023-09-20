<template>
  <div class="">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>

    <v-data-table
      :headers="data.headers"
      :items="data.items"
      :single-expand="true"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-col cols="6" sm="12" md="4" class="pa-0">
            <v-text-field
              outlined
              label="Search"
              @keyup="filterDocument()"
              :items="data.itemsToFilter"
              v-model="data.searchTerm"
              clearable
            ></v-text-field>
          </v-col>
        </v-card-title>
      </template>

      <template v-slot:item="props">
        <custom-table-row :item="props.item" />
      </template>
      <template v-slot:footer>
        <Paginate
          :params="data.response"
          :rows="data.rows"
          @onPageChange="getData"
        />
      </template>
      <template v-slot:item="props">
        <custom-table-row :item="props.item" @row-clicked="handleRowClick" />
      </template>
    </v-data-table>

    <Modal :modal="data.deletemodal" :width="320">
      <template v-slot:header>
        <ModalHeader :title="`Delete Data `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="green darken-1" text @click="cancelConfirmDialog"
            >Cancel</v-btn
          >
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useQueryUser } from "./composables/query-user";
import CustomTableRow from "./ToolTip.vue"; // Import the custom row component

export default defineComponent({
  name: "QueryUserComponent",
  components: {
    CustomTableRow,
  },

  setup() {
    const {
      data,
      openDialog,
      getData,
      cancelDialog,
      getDocumentCategory,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      initialize,
      deleteDocument,
      updateDocument,
      handleSelectedFiles,
      createDocument,
      selectedFile,
      downloadFile,
      filterDocument,
      deleteDialog,
      handleRowClick,
    } = useQueryUser();

    return {
      data,
      openDialog,
      getData,
      cancelDialog,
      getDocumentCategory,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      initialize,
      deleteDocument,
      updateDocument,
      handleSelectedFiles,
      createDocument,
      selectedFile,
      downloadFile,
      filterDocument,
      deleteDialog,
      handleRowClick,
    };
  },
});
</script>

<style scoped></style>
./composables/query-detail ./composables/query-user
