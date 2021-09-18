<template>
  <div class="customers">
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
        :single-expand="true"
        class="elevation-1"
        disable-pagination
        hide-default-footer
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
              <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="deleteGfsCode(item.id)">mdi-trash-can-outline</v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Gfs Codes`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="data.formData.name" label="Name" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="data.formData.code" label="Code" required></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-autocomplete
                    v-model="data.formData.category_id"
                    label="Category"
                    :items="data.gfscategories"
                    :item-text="'description'"
                    item-value="id"
                    :item-divider="true"
                    required
                    clearable
                  ></v-autocomplete>
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
        <ModalHeader :title="`Delete Gfs Codes `" />
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
import { GfsCodes } from "./types/";
import store from "@/store";
import { defineComponent, reactive, watch, onMounted, computed, ref } from "@vue/composition-api";

import { get, create, update, destroy, search } from "./service/gfs.service";
import { gfscategories } from "../gfs-category/service/gfs-categories.service";

export default defineComponent({
  name: "GfsCodes",
  setup() {
    let dataItems: Array<GfsCodes> = [];
    let gfsCategoryData: GfsCodes;
    let fileToupload = ref("");
    let imageUrl: any = ref("");

    let data = reactive({
      title: "Manage GfsCodes",
      modalTitle: "",
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Code", align: "start", sortable: false, value: "code" },
        {
          text: "Category code",
          align: "start",
          sortable: false,
          value: "category.description",
        },

        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: gfsCategoryData,
      documentcategories: [],
      gfscategories: [],
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      response: {},
    });

    onMounted(() => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
      });
      gfscategories({ per_page: 2000 }).then((response: any) => {
        console.log("gfscode categories", response.data.data.data);
        data.gfscategories = response.data.data.data;
      });
    });

    computed(() => {
      return "test";
    });

    const searchCategory = (categoryName) => {
      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
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

    const deleteGfsCode = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };
    const getGfsCode = () => {
      get(data).then((response) => {
        // console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as GfsCodes;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as GfsCodes;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        reloadData();
        data.deletemodal = false;
      });
    };

    const save = () => {
      if (data.formData.id) {
        updateGfsCodes(data.formData);
      } else {
        createUser(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as GfsCodes;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateGfsCodes = (data: any) => {
      update(data).then((response) => {
        reloadData();
        cancelDialog();
      });
    };

    const createUser = (data: any) => {
      create(data).then((response) => {
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
      });
    });

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };
    watch(
      () => store.state.snackbar,
      () => {
        // console.log("datazzzzz", store.getters.getSnackBar);
      }
    );

    return {
      data,
      openDialog,
      cancelDialog,
      deleteGfsCode,
      getGfsCode,
      updateGfsCodes,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      imageUrl,
      getData,
    };
  },
});
</script>

<style scoped></style>
