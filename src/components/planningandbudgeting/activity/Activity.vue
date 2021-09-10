<template>
  <div class="Activity">
    <Snackbar />

    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'Activity')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
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

        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-2"
            @click="openDialog(item)"
            :disabled="cant('edit', 'Activity')"
          >
            mdi-pencil-box-outline
          </v-icon>
          <v-icon
            @click="openConfirmDialog(item.id)"
            :disabled="cant('delete', 'Activity')"
          >
            mdi-trash-can-outline
          </v-icon>
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
        <ModalHeader :title="`${data.modalTitle} Activity`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
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
                  <v-select
                    v-model="data.formData.project_id"
                    :items="data.projects"
                    item-text="description"
                    item-value="id"
                    label="Project"
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="data.formData.sub_budget_class_id"
                    :items="data.subBudgetClasses"
                    item-text="description"
                    item-value="id"
                    label="Sub budget class"
                    required
                  ></v-autocomplete>
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
          <v-btn color="green darken-1" text @click="save"
            >{{ data.modalTitle }}
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
import { Activity } from "./types/Activity";
import { Project } from "@/components/setup/projects/types/Project";
import {
  defineComponent,
  reactive,
  onMounted,
} from "@vue/composition-api";

import {
  get,
  create,
  update,
  destroy,
  search,
} from "./services/activity.service";
import { get as getProject } from "@/components/setup/projects/services/project.service";
import { get as getSubBudgetClass } from "@/components/setup/sub-budget-classes/services/sub-budget-classes.service";
import { AxiosResponse } from "axios";

export default defineComponent({
  name: "Facility",
  setup() {
    let dataItems: Array<Activity> = [];
    let projects: Array<Project> = [];
    let facilityData: Activity;
    let subBudgetClasses: [];

    let data = reactive({
      title: "Manage Activities",
      valid: true,
      isOpen: false,
      node: null,
      response: {},
      modalTitle: "",
      headers: [
        {
          text: "Code",
          align: "start",
          sortable: false,
          value: "code",
        },
        {
          text: "Description",
          align: "start",
          sortable: false,
          value: "description",
        },
        {
          text: "Project",
          align: "start",
          sortable: false,
          value: "project.name",
        },
        {
          text: "Sub budget class",
          align: "start",
          sortable: false,
          value: "sub_budget_class.name",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
        },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: facilityData,
      params: {
        total: 100,
        size: 10,
      },
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      projects: projects,
      subBudgetClasses: subBudgetClasses,
    });

    onMounted(() => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
      getProjectData();
      getSubBudgetClassData();
    });

    const searchCategory = (categoryName) => {
      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
          data.items = response.data.data.data;
        });
      }
    };

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openConfirmDialog = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
    };

    const getProjectData = () => {
      getProject({ per_page: 20 }).then((response: AxiosResponse) => {
        data.projects = response.data.data.data;
      });
    };

    const getSubBudgetClassData = () => {
      getSubBudgetClass({ per_page: 20 }).then((response: AxiosResponse) => {
        data.subBudgetClasses = response.data.data.data;
      });
    }

    const cancelDialog = () => {
      data.formData = {} as Activity;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as Activity;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        data.deletemodal = false;
      });
    };

    const save = () => {
      if (data.formData.id) {
        updateActivity(data.formData);
      } else {
        createActivity(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as Activity;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateActivity = (data: any) => {
      update(data).then(() => {
        cancelDialog();
      });
    };

    const createActivity = (data: any) => {
      create(data).then(() => {
        cancelDialog();
      });
    };

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      getProjectData,
      updateActivity,
      save,
      remove,
      cancelConfirmDialog,
      searchCategory,
      getData,
      getSubBudgetClassData
    };
  },
});
</script>

<style scoped></style>
