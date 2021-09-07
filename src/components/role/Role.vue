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
          <v-btn
            color="blue darken-1"
            text
            @click="navigateToAddPermissions(item)"
          >
            ADD PERMISSIONS
          </v-btn>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Role`" />
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
                  <v-text-field label="Description" v-model="data.formData.description" required> </v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n8">
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-label><h5>SELECT ROLE LEVEL</h5></v-label>
                  <v-radio-group row v-model="data.formData.level_id" :mandatory="true">
                    <v-radio v-for="row in data.levels" :key="row.id" :label="row.name" :value="row.id"> </v-radio>
                  </v-radio-group>
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
      :message="'Are you sure you want to delete this role?'"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="'Delete Role'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { get, create, update, deleteRole } from "./services/role-services";
import { get as getLevels } from "@/components/admin-area/level/services/level-services";
import { AxiosResponse } from "axios";
import router from '@/router'
import { Role } from "./types/Role";
import { Level } from "@/components/admin-area/level/types/Level";

export default defineComponent({
  setup() {
    let dataItems: Array<Role> = [];
    let levelItems: Array<Level> = [];
    let roleData = {} as Role;
    let data = reactive({
      title: "Manage Roles",
      valid: true,
      isOpen: false,
      item: roleData,
      response: {},
      modalTitle: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Display Name", align: "start", sortable: false, value: "display_name" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      items: dataItems,
      formData: roleData,
      rows: ["5", "10", "15"],
      levels: levelItems,
    });

    onMounted(() => {
      get({}).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.items = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
      loadLevels();
    });

    const cancelDialog = () => {
      data.formData = {} as Role;
      data.modal = !data.modal;
    };

    const save = () => {
      if (data.formData.id) {
        updateRole(data.formData);
      } else {
        createRole(data.formData);
      }
    };

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openDialog = (formData?: Role) => {
      if (formData && formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateRole = (data: Role) => {
      update(data).then((response: AxiosResponse) => {
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const navigateToAddPermissions = (item: any) => {
      router.push({ path: `/roles/${item.id}/add-permissions` })
    };

    const createRole = (data: Role) => {
      create(data);
    };

    const openConfirmDialog = (item: Role) => {
      data.item = item;
      data.isOpen = true;
    };

    const closeConfirmDialog = () => {
      data.item = {} as Role;
      data.isOpen = false;
    };

    const deleteItem = (item: number | string) => {
      const payload = item;
      deleteRole(payload).then((response: AxiosResponse) => {
        console.log(response);
      });
      data.item = {} as Role;
      data.isOpen = false;
    };

    const loadLevels = () => {
      getLevels({}).then((response: AxiosResponse) => {
        data.levels = response.data.data.data;
      });
    };

    return {
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,

      getData,
      loadLevels,
      navigateToAddPermissions,

      updateRole,
      save,
      deleteItem,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
