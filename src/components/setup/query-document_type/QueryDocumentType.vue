<template>
  <div class="">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn large color="teal" class="white--text" @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card>
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
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="openDialog(item)"
              >
                mdi-pencil-box-outline
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="deleteDialog(item.id)"
                >mdi-trash-can-outline</v-icon
              >
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
    <Modal :modal="data.modal" :width="750">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Query Document Type`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form ref="form" enctype="multipart/form-data">
            <v-container>
              <v-row>
                <v-col cols="12" md="12" class="mb-n8">
                  <v-text-field
                    v-model="data.formData.name"
                    outlined
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12" class="mb-n8">
                  <v-text-field
                    v-model="data.formData.description"
                    outlined
                    label="Description"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" class="mb-n8">
                  <v-select
                    :items="data.queryCategories"
                    prepend-inner-icon="mdi-file-document-multiple"
                    label="Select Query Category"
                    outlined
                    v-model="data.formData.queryCategoryId"
                    :item-text="'name'"
                    item-value="id"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }} -{{ item.description }}
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="12" class="mb-n8">
                  <v-checkbox
                    v-model="data.formData.is_claim"
                    :label="`Check if this document type is for claiming`"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="save"
            >{{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

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
import { useQueryDocumentType } from "./composables/query-document_type";

export default defineComponent({
  name: "QueryStatusComponent",
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
    } = useQueryDocumentType();

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
    };
  },
});
</script>

<style scoped></style>
./composables/query-document_type
