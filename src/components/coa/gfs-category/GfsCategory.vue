<template>
  <div class="meta-data-category">
    <v-card-actions class="pa-0">
      <h2>Manage GFS Categories</h2>
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
        class="elevation-1"
        item-key="id"
        :expanded.sync="data.expanded"
        :single-expand="true"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-text-field
                @input="searchCategory($event)"
                class
                clearable
                flat
                hide-details
                prepend-icon="mdi-magnify"
                label="Filter by Category Name"
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:item="{ item, isExpanded, expand }">
          <tr>
            <td>{{ item.description }}</td>

            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="expand(!isExpanded)">
                    mdi-format-list-bulleted
                  </v-icon>
                </template>
                <span>List of Gfs codes</span>
              </v-tooltip>
            </td>
            <td>
              <v-icon class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
              <v-icon @click="deleteGfsCategory(item.id)"> mdi-trash-can-outline </v-icon>
            </td>
          </tr>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pb-5 pa-3">
            <b>Category Name:</b>
            {{ item.description }}
            <br />
            Category Code:
            <em>
              <b class="pa-3">{{ item.code }}</b>
            </em>
            <v-card outlined flat max-width="80%">
              <v-data-table
                :headers="data.gfsCodes"
                :items="item.gfs_codes"
                :items-per-page="item.metadataOptions ? item.metadataOptions.length : 20"
                hide-default-footer
                dense
              ></v-data-table>
            </v-card>
          </td>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} GfsCode Category`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="data.formData.description" label="Description" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="data.formData.code" label="Code" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="save">{{ data.modalTitle }} </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete GfsCodes `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="green darken-1" text @click="cancelConfirmDialog">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";
import { GfsCategories } from "./types/";
import { defineComponent, reactive, onMounted, ref } from "@vue/composition-api";

import { get, create, update, destroy, search } from "./service/gfs-categories.service";

export default defineComponent({
  name: "GfsCategories",
  setup() {
    let dataItems: Array<GfsCategories> = [];
    let documentCategoryData: GfsCategories;
    let fileToupload = ref("");
    let imageUrl: any = ref("");

    let data = reactive({
      title: "Manage Gfs Categories",
      modalTitle: "",
      headers: [
        {
          text: "Category Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Gfs Codes List",
          align: "start",
          sortable: false,
          value: "code",
        },

        { text: "Actions", value: "actions", sortable: false },
      ],
      gfsCodes: [
        { text: "Gfs Name", align: "start", sortable: false, value: "name" },
        { text: "Gfs Code", align: "start", sortable: false, value: "code" },
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
      documentcategories: [],
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      response: {},
    });

    onMounted(() => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = {
          from,
          to,
          total,
          current_page,
          per_page,
          last_page,
        };
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
      });
    });

    const searchCategory = (categoryName) => {
      console.log("argument", categoryName);

      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
          console.log("response data", response);
          data.items = response.data.data.data;
        });
      } else {
        reloadData();
      }
    };

    const reloadData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });
    };

    const deleteGfsCategory = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };
    const getGfsCategory = () => {
      get(data).then((response) => {
        console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as GfsCategories;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as GfsCategories;
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
        updateGfsCategory(data.formData);
      } else {
        createCategory(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as GfsCategories;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateGfsCategory = (data: any) => {
      update(data).then((response) => {
        reloadData();
        cancelDialog();
      });
    };

    const createCategory = (data: any) => {
      create(data).then((response) => {
        reloadData();
        cancelDialog();
      });
    };
    // watching a getter

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    return {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteGfsCategory,
      getGfsCategory,
      updateGfsCategory,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      imageUrl,
    };
  },
});
</script>

<style scoped></style>
