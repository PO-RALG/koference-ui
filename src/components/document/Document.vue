<template>
  <div class="customers">
    <Snackbar />

    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        :server-items-length="data.params.total"
        :options.sync="data.pagination"
        :items-per-page="data.params.size"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Name"
                @change="searchCategory($event)"
                :items="data.itemsToFilter"
                :item-text="'name'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.startDate`]="{ item }">
          <span>{{ item.startDate }}</span>
        </template>
        <template v-slot:[`item.endDate`]="{ item }">
          <span>{{ item.endDate }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
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
              <v-icon v-bind="attrs" v-on="on" @click="deleteDocument(item.id)"
                >mdi-trash-can-outline</v-icon
              >
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Document`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.name"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.link"
                    label="Link"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="data.formData.document_category_id"
                    label="category"
                    :items="data.documentcategories"
                    :item-text="'name'"
                    item-value="id"
                    :item-divider="true"
                    required
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <input type="file" @change="handleSelectedFiles" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save"
            >{{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Document `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelConfirmDialog"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Document } from "./types/Document";
import store from "@/store";
import {
  defineComponent,
  reactive,
  watch,
  onMounted,
  computed,
  ref,
} from "@vue/composition-api";

import {
  get,
  create,
  update,
  destroy,
  search,
} from "./services/document.service";
import { documentcategoried } from "../documentcategories/services/documentcategory.service";

export default defineComponent({
  name: "Document",
  setup() {
    let dataItems: Array<Document> = [];
    let documentCategoryData: Document;
    let fileToupload = ref("");
    let imageUrl: any = ref("");

    let data = reactive({
      title: "Manage Document",
      modalTitle: "",
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        {
          text: "Description",
          align: "start",
          sortable: false,
          value: "description",
        },
        {
          text: "Link",
          align: "start",
          sortable: false,
          value: "link",
        },

        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: documentCategoryData,
      params: {
        total: 10,
        size: 10,
      },
      itemtodelete: "",
      documentcategories: [],
    });

    onMounted(() => {
      // make api call
      let params: any = {
        total: 10,
        size: 10,
      };
      get(params).then((response: any) => {
        console.log("data to render", response.data.data);
        data.items = response.data.data;
        data.itemsToFilter = response.data.data;
      });
      documentcategoried().then((response: any) => {
        console.log("documentcategories", response.data.data);
        data.documentcategories = response.data.data;
      });
    });

    computed(() => {
      return "test";
    });

    const searchCategory = (categoryName) => {
      console.log("argument", categoryName);

      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
          console.log("response data", response);
          data.items = response.data.data;
        });
      } else {
        reloadData();
      }
    };

    const reloadData = () => {
      let params: any = {
        total: 10,
        size: 10,
      };
      get(params).then((response: any) => {
        console.log("data", response.data.data);
        data.items = response.data.data;
      });
    };

    const deleteDocument = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };
    const getDocument = () => {
      get(data).then((response) => {
        console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as Document;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as Document;
      data.deletemodal = false;
    };

    const remove = () => {
      console.log("delete data with id", data.itemtodelete);
      destroy(data.itemtodelete).then(() => {
        reloadData();
        data.deletemodal = false;
      });
    };

    const save = () => {
      console.log("Form Data", data.formData);
      if (data.formData.id) {
        updateDocument(data.formData);
      } else {
        data.formData.created_by = 1;
        createUser(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as Document;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateDocument = (data: any) => {
      update(data).then((response) => {
        console.log("Updated data", response.data);
        reloadData();
        cancelDialog();
      });
    };
    const handleSelectedFiles = (event: any) => {
      if (event.target.files.length === 0) {
        imageUrl.value = "";
        fileToupload.value = "";
        return;
      }
      data.formData.document_file = event.target.files[0];
      // console.log("event", event);
      fileToupload.value = event.target.files[0];
    };

    const createUser = (data: any) => {
      create(data).then((response) => {
        console.log("Created data", response.data);
        reloadData();
        cancelDialog();
      });
    };
    // watching a getter

    watch(fileToupload, (fileToupload: any) => {
      if (!(fileToupload instanceof File)) {
        return;
      }
      let fileReader = new FileReader();

      fileReader.readAsDataURL(fileToupload);

      fileReader.addEventListener("load", () => {
        imageUrl.value = fileReader.result;
        console.log("setup", imageUrl.value);
      });
    });

    watch(
      () => store.state.snackbar,
      () => {
        console.log("datazzzzz", store.getters.getSnackBar);
      }
    );

    return {
      data,
      openDialog,
      cancelDialog,
      deleteDocument,
      getDocument,
      updateDocument,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      handleSelectedFiles,
      imageUrl,
    };
  },
});
</script>

<style scoped></style>
