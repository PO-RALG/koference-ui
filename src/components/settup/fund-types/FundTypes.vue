<template>
  <div class="fund-types">
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
        class="elevation-1"
        item-key="id"
        :single-expand="true"
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
                label="Search by Name"
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.description }}</td>
            <td>{{ item.code }}</td>

            <td>
              <v-icon class="mr-2" @click="openDialog(item)">
                mdi-pencil-box-outline
              </v-icon>
              <v-icon @click="deleteFundType(item.id)">
                mdi-trash-can-outline
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Fund Types`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.code"
                    label="Code"
                    required
                  ></v-text-field>
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
        <ModalHeader :title="`Delete Fund Types `" />
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
import { FundTypes } from "./types";
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
} from "./service/fund-types.service";

export default defineComponent({
  name: "FundTypes",
  setup() {
    let dataItems: Array<FundTypes> = [];
    let documentCategoryData: FundTypes;
    let fileToupload = ref("");
    let imageUrl: any = ref("");

    let data = reactive({
      title: "Manage FundTypes",
      modalTitle: "",
      headers: [
        {
          text: "Desciption",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Code",
          align: "start",
          sortable: false,
          value: "code",
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
        console.log("fund types to render", response.data.data);
        data.items = response.data.data;
        data.itemsToFilter = response.data.data;
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

    const deleteFundType = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };
    const getFundTypes = () => {
      get(data).then((response) => {
        console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as FundTypes;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as FundTypes;
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
        updateFinancialYear(data.formData);
      } else {
        createUser(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as FundTypes;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateFinancialYear = (data: any) => {
      update(data).then((response) => {
        console.log("Updated data", response.data);
        reloadData();
        cancelDialog();
      });
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
      deleteFundType,
      getFundTypes,
      updateFinancialYear,
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
