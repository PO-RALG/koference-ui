<template>
  <div class="">
    <v-card-actions class="pa-3">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        v-show="!data.hideOpened"
        large
        color="primary"
        class="white--text"
        @click="reloadClosedCase"
      >
        <v-icon>mdi-reload</v-icon>
        Load Closed
      </v-btn>
      <v-btn
        v-show="data.hideOpened"
        large
        color="secondary"
        class="white--text"
        @click="reloadData"
      >
        <v-icon>mdi-reload</v-icon>
        Load Opened
      </v-btn>
      <v-btn large color="teal" class="white--text" @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
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
          <h3 v-if="!data.hideOpened">{{ "Opened Grievance" }}</h3>
          <h3 v-else>{{ "Closed Grievance" }}</h3>
          <v-spacer></v-spacer>
          <v-col v-show="!data.hideOpened" cols="6" sm="12" md="4" class="pa-0">
            <v-text-field
              v-model="data.searchQuery"
              append-icon="mdi-magnify"
              placeholder="Enter tracknumber,PAP first name or last name "
              clearable
              @click:append="filterQuery(data.searchQuery)"
              @click:clear="clearSearch"
              outlined
              label="Search"
              :items="data.itemsToFilter"
            ></v-text-field>
          </v-col>
          <v-col v-show="data.hideOpened" cols="6" sm="12" md="4" class="pa-0">
            <v-text-field
              v-model="data.searchQuery"
              append-icon="mdi-magnify"
              placeholder="Enter tracknumber,PAP first name or last name "
              clearable
              @click:append="filterQueryClosed(data.searchQuery)"
              @click:clear="reloadClosedCase"
              outlined
              label="Search"
              :items="data.itemsToFilter"
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

    <Modal :modal="data.modal" :width="1000" :fullScreen="true">
      <template v-slot:header>
        <ModalHeader
          :title="`TUMA LALAMIKO`"
          :icon="'mdi-send'"
          :is_signup="true"
          :is_known="data.selectedOption"
          :is_claiming="true"
        />
      </template>
      <template v-slot:body>
        <v-container class="d-flex justify-center align-center"> </v-container>
        <v-container class="d-flex justify-center align-center">
          <v-col cols="12" md="7" class="mt-n3">
            <v-text-field
              v-model="data.searchUser"
              append-icon="mdi-magnify"
              label="Weka namba ya simu"
              placeholder="Weka namba ya simu(Phone number)"
              solo-inverted
              clearable
              @click:append="trackUser(data.searchUser)"
              :disabled="data.retrivedUserToBind"
            ></v-text-field>
          </v-col>
        </v-container>
        <v-container
          v-if="data.retrivedUserToBind"
          class="d-flex justify-center align-center"
        >
          Umetambulika kwa majina:
          <span class="font-weight-bold text-uppercase">
            {{ data?.retrivedUserToBind?.first_name }} {{ " " }}
            {{ data?.retrivedUserToBind?.last_name }}</span
          >
        </v-container>
        <ModalBody v-if="data.formData">
          <v-form ref="form" enctype="multipart/form-data">
            <v-container>
              <v-row>
                <v-col cols="12" md="12" class="mb-n8">
                  <v-col cols="12" md="12" class="mb-n8">
                    <v-textarea
                      outlined
                      name="input-7-4"
                      label="Andika Maelezo Hapa Chini"
                      v-model="data.formData.description"
                    ></v-textarea>
                  </v-col>

                  <!-- start -->
                  <v-row>
                    <v-card-text>
                      <v-row>
                        <v-col
                          v-for="item in data.documentTypes"
                          :key="item.id"
                          cols="12"
                          sm="6"
                          md="3"
                        >
                          <label for="file" class="label">
                            <small class="t-color">
                              {{ item.name }}
                            </small>
                          </label>
                          <v-file-input
                            @change="saveFile($event, item)"
                            v-model="item.file"
                            color=""
                            placeholder="chagua faili"
                            filled
                            outlined
                            :show-size="1000"
                          >
                          </v-file-input>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-row>
                  <v-btn
                    :disabled="!data.formData.description"
                    @click="submitFomrm"
                    color="green lighten-2"
                    large
                    class="white--text"
                    >{{ "Wasilisha  lalamiko" }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
        <ModalFooter> <v-spacer></v-spacer> </ModalFooter>
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
import { useQuery } from "./composables/query";
import CustomTableRow from "./ToolTip.vue"; // Import the custom row component

export default defineComponent({
  name: "QueryComponent",
  components: {
    CustomTableRow,
  },

  setup() {
    const {
      data,
      submitFomrm,
      openDialog,
      reloadClosedCase,
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
      filterQuery,
      filterQueryClosed,
      deleteDialog,
      handleRowClick,
      clearSearch,
      saveFile,
      trackUser,
    } = useQuery();

    return {
      data,
      trackUser,
      submitFomrm,
      openDialog,
      reloadClosedCase,
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
      filterQuery,
      filterQueryClosed,
      deleteDialog,
      handleRowClick,
      clearSearch,
      saveFile,
    };
  },
});
</script>

<style scoped></style>
./composables/query-detail
