<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table :headers="data.headers" :items="data.items" hide-default-footer class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
          <v-icon @click="openConfirmDialog(item)"> mdi-trash-can-outline </v-icon>
        </template>
      </v-data-table>
      <Paginate :params="data.response" @onPageChange="getData" />

    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Admin Area`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field label="Name" v-model="data.formData.name" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field label="Slug" v-model="data.formData.code"> </v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n8">
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-label><h5>SELECT LOCATION LEVEL</h5></v-label>
                  <v-radio-group row v-model="data.formData.level_id" :mandatory="true">
                    <v-radio
                      v-for="row in data.levels"
                      :key="row.id"
                      :label="row.name"
                      :value="row.id"
                      @change="setLevel(row.id)"
                    >
                    </v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-col cols="12" sm="12" md="12" class="hierarchy-container">
                <v-label><h5>SELECT LOCATION PARENT</h5></v-label>
                <TreeBrowser
                  v-if="data.node"
                  @onClick="loadLocationChildren"
                  :node="data.node"
                  :currentItem="data.currentItem"
                />
              </v-col>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter class="mt-n8">
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
    <ConfirmDialog
      @rejectFunction="closeConfirmDialog"
      @acceptFunction="deleteItem"
      :message="'Are you sure you want to delete this level?'"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="'Delete AdminArea'"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  onMounted,
  computed,
  set,
} from "@vue/composition-api";

import { AxiosResponse } from "axios";
import {
  get,
  createArea,
  updateArea,
  deleteArea,
  getChildren,
} from "./services/admin-area-services";

import { get as getLevels } from "../level/services/level-services";
import { Level } from "../level/types/Level";
import { AdminArea } from "./types/AdminArea";

export default defineComponent({
  setup() {
    let dataItems: Array<AdminArea> = [];
    let levelItems: Array<Level> = [];
    let adminAreaData: AdminArea = {
      id: null,
      name: "",
      code: "",
      description: "",
      parent_id: null,
      level_id: null,
      active: false,
    };
    let data = reactive({
      title: "Manage Admin Areas",
      valid: true,
      isOpen: false,
      node: null,
      item: null,
      currentItem: null,
      levels: levelItems,
      modalTitle: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Code", value: "code" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      items: dataItems,
      response: {},
      formData: adminAreaData,
      params: {
        total: 100,
        size: 10,
      },
      nameRules: [(v: any) => !!v || "Name is required"],
    });

    const cancelDialog = () => {
      data.formData = {} as AdminArea;
      data.modal = !data.modal;
    };

    const setLevel = () => {
      console.log("set level");
    };

    const save = () => {
      if (data.formData.id) {
        update(data.formData);
      } else {
        create(data.formData);
      }
    };

    let levels = computed(() => data.levels);

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openDialog = (formData?: AdminArea) => {
      console.log("item", formData);
      if (formData && formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const update = (data: AdminArea) => {
      updateArea(data).then((response) => {
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const create = (data: AdminArea) => {
      createArea(data).then((response) => {
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const openConfirmDialog = (item: AdminArea) => {
      data.item = item;
      data.isOpen = true;
    };

    const closeConfirmDialog = () => {
      data.item = {};
      data.isOpen = false;
    };

    const deleteItem = (item: number | string) => {
      deleteArea(item).then((response) => {
        console.log(response);
      });
      data.item = null;
      data.isOpen = false;
    };

    const loadLocationChildren = (location: any) => {
      data.currentItem = location.id;
      data.formData.parent_id = location.id;
      if (!location.children) {
        if (location.id !== data.node.id) {
          getChildren(location.id).then((response: AxiosResponse) => {
            if (response.data.data.children.length) {
              set(location, "children", response.data.data.children);
            }
          });
        }
      }
    };

    const searchLevels = (term) => {
      data.levels = data.levels.filter((level) => level.name.includes(term));
    };

    const getNodes = (id?: number | string) => {
      getChildren(id).then((response: AxiosResponse) => {
        data.node = response.data.data;
      });
    };

    onMounted(() => {
      get({}).then((response: any) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
        data.items = response.data.data.data;
      });

      getLevels({}).then((response: AxiosResponse) => {
        data.levels = response.data.data.data;
      });

      getNodes();
    });

    return {
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      getData,

      updateArea,
      save,
      deleteItem,

      loadLocationChildren,
      searchLevels,
      getNodes,
      setLevel,

      levels,
    };
  },
});
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 3px;
}
</style>
