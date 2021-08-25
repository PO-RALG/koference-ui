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
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        :server-items-length="data.params.total"
        :options.sync="data.pagination"
        :items-per-page="data.params.size"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
          <v-icon @click="openConfirmDialog(item)"> mdi-trash-can-outline </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Level`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-text-field label="Name" v-model="data.formData.name" required> </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="12" class="mt-n8">
                  <v-text-field label="Slug" v-model="data.formData.slug"> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" class="mt-n8">
                  <v-text-field label="Position" v-model="data.formData.position" required> </v-text-field>
                </v-col>
              </v-row>
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
      :title="'Delete Level'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import {
  get,
  createLevel,
  updateLevel,
  deleteLevel,
} from "./services/level-services";
import { Level } from "./types/Level";

export default defineComponent({
  setup() {
    let dataItems: Array<Level> = [];
    let levelData!: Level;
    let data = reactive({
      title: "Manage Levels",
      valid: true,
      isOpen: false,
      item: null,
      modalTitle: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Slug", value: "slug" },
        { text: "Position", align: "start", sortable: true, value: "position" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      items: dataItems,
      formData: levelData,
      params: {
        total: 100,
        size: 10,
      },
      nameRules: [(v: any) => !!v || "Name is required"],
    });

    onMounted(() => {
      get({}).then((response: any) => {
        data.items = response.data.data;
      });
    });

    const cancelDialog = () => {
      data.formData = {} as Level;
      data.modal = !data.modal;
    };

    const save = () => {
      if (data.formData.id) {
        update(data.formData);
      } else {
        create(data.formData);
      }
    };

    const openDialog = (formData?: Level) => {
      if (formData && formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as Level;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const update = (data: Level) => {
      updateLevel(data).then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const create = (data: Level) => {
      createLevel(data).then((response) => {
        if (response.status === 200) {
          cancelDialog();
        }
      })
    };

    const openConfirmDialog = (item: Level) => {
      data.item = item;
      data.isOpen = true;
    };

    const closeConfirmDialog = () => {
      data.item = null;
      data.isOpen = false;
    };

    const deleteItem = (item: number | string) => {
      deleteLevel(item).then((response) => {
        console.log(response);
      });
      data.item = null;
      data.isOpen = false;
    };

    return {
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,

      updateLevel,
      save,
      deleteItem,
    };
  },
});
</script>

<style scoped></style>
<style scoped></style>
