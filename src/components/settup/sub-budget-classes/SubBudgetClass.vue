<template>
  <div class="sub-budget-classes">
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
        :single-expand="true"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Code"
                @change="searchCategory($event)"
                :items="data.itemsToFilter"
                :item-text="'code'"
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
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="deleteSubBudgetClass(item.id)"
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
        <ModalHeader :title="`${data.modalTitle} SubBudgetClass`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.code"
                    label="Code"
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
                  <v-autocomplete
                    v-model="data.formData.funding_type_id"
                    label="Fund type"
                    :items="data.fundingtypes"
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
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save"
            >{{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Sub Budget Class `" />
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
import { SubBudgetClass } from "./types/SubBudgetClass";
import store from "@/store";
import {
  defineComponent,
  reactive,
  watch,
  onMounted,
  computed,
} from "@vue/composition-api";

import {
  get,
  create,
  update,
  destroy,
  search,
} from "./services/sub-budget-classes.service";
import { fundingtypes } from "../fund-types/service/fund-types.service";

export default defineComponent({
  name: "SubBudgetClass",
  setup() {
    let dataItems: Array<SubBudgetClass> = [];
    let documentCategoryData: SubBudgetClass;

    let data = reactive({
      title: "Manage Sub Budget Class",
      modalTitle: "",
      headers: [
        { text: "Code", align: "start", sortable: false, value: "code" },
        {
          text: "Description",
          align: "start",
          sortable: false,
          value: "description",
        },
        {
          text: "Fund Type",
          align: "start",
          sortable: false,
          value: "fund_type.name",
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
      fundingtypes: [],
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
      fundingtypes().then((response: any) => {
        console.log("funding types", response.data.data);
        data.fundingtypes = response.data.data;
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

    const deleteSubBudgetClass = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };
    const getSubBudgetClass = () => {
      get(data).then((response) => {
        console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as SubBudgetClass;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as SubBudgetClass;
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
        data.formData = {} as SubBudgetClass;
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
      deleteSubBudgetClass,
      getSubBudgetClass,
      updateFinancialYear,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
    };
  },
});
</script>

<style scoped></style>
