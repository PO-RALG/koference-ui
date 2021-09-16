<template>
  <div class="Activity Costing">
    <Snackbar />

    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        hide-default-footer
        class="elevation-1"
        disable-pagination
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Code"
                @change="searchItem($event)"
                :items="data.itemsToFilter"
                :item-text="'activity.code'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
          </v-card-title>
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

    <Modal :modal="data.modal" :width="960">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Activity Costing`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="data.formData.code"
                    label="Code"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-select
                    v-model="data.formData.project_id"
                    :items="data.projects"
                    item-value="id"
                    label="Project"
                    required
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.code }} - {{ item.description }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.code }} - {{ item.description }}
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            v-model="data.searchTerm"
                            placeholder="Search"
                            @input="searchProjects"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="5">
                  <v-select
                    v-model="data.formData.sub_budget_class_id"
                    :items="data.subBudgetClasses"
                    item-value="id"
                    label="Sub budget class"
                    required
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.code }} - {{ item.description }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.code }} - {{ item.description }}
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            v-model="data.searchTerm"
                            placeholder="Search"
                            @input="searchSubBudgetClasses"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
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
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="save">
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Activity `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { ActivityCosting } from "./types/ActivityCosting";
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import {
  get,
  create,
  update,
  destroy,
  search,
} from "./services/activity-costing.service";
import { AxiosResponse } from "axios";

export default defineComponent({
  name: "ActivityCosting",
  setup() {
    let dataItems: Array<ActivityCosting> = [];
    let activityCostingData = {} as ActivityCosting;

    let data = reactive({
      title: "Activity Costings",
      valid: true,
      isOpen: false,
      node: null,
      response: {},
      modalTitle: "",
      headers: [
        {
          text: "Activity",
          align: "start",
          sortable: false,
          value: "activity.description",
        },
        {
          text: "Activity code",
          align: "start",
          sortable: false,
          value: "activity.code",
        },
        {
          text: "GFS code",
          align: "start",
          sortable: false,
          value: "account.code",
        },
        {
          text: "Funding Source",
          align: "start",
          sortable: false,
          value: "planrep_batch_no",
        },
        {
          text: "Amount",
          align: "start",
          sortable: false,
          value: "amount",
        },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: activityCostingData,
      params: {
        total: 100,
        size: 10,
      },
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
    });

    onMounted(() => {
      getTableData();
    });

    const getTableData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
    };

    const searchItem = (itemName: any) => {
      if (itemName != null) {
        search({ code: itemName.activity.code }).then(
          (response: AxiosResponse) => {
            data.items = response.data.data.data;
          }
        );
      }
    };

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openConfirmDialog = (deleteId: string) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
    };

    const cancelDialog = () => {
      data.formData = {} as ActivityCosting;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as ActivityCosting;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        data.deletemodal = false;
        getTableData();
      });
    };

    const save = () => {
      if (data.formData.id) {
        updateActivityCosting(data.formData);
      } else {
        createActivityCosting(data.formData);
      }
    };

    const openDialog = (formData?: ActivityCosting) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as ActivityCosting;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateActivityCosting = (data: ActivityCosting) => {
      update(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    const createActivityCosting = (data: ActivityCosting) => {
      create(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateActivityCosting,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
    };
  },
});
</script>

<style scoped></style>
