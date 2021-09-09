<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="can('create', 'AuthMenuItem')">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        disable-pagination
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)" :disabled="can('edit', 'AuthMenuItem')">
            mdi-pencil-box-outline
          </v-icon>
          <v-icon @click="openConfirmDialog(item)" :disabled="can('delete', 'AuthMenuItem')">
            mdi-trash-can-outline
          </v-icon>
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

        <template v-slot:[`item.icon`]="{ item }">
          <v-icon class="mr-2">{{ item.icon }}</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Menu Item`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="Icon" v-model="data.formData.icon" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="Code" v-model="data.formData.code" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="Name" v-model="data.formData.name" required> </v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n8">
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field label="State" v-model="data.formData.state" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-select
                    v-model="data.formData.auth_menu_group_id"
                    item-text="name"
                    :items="data.menuGroups"
                    item-value="id"
                    label="Select Menu Group"
                  >
                  </v-select>
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
      :message="'Are you sure you want to delete this menu item?'"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="'Delete Menu Item'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import router from "@/router";
import { get, create, update, deleteEntry } from "./services/menu.service";
import { MenuItem } from "./types/MenuItem";

export default defineComponent({
  setup() {
    const TYPE = "MENU_ITEM";
    let dataItems: Array<MenuItem> = [];
    let menuItemData = {} as MenuItem;
    let data = reactive({
      title: "Manage Menu Items",
      valid: true,
      isOpen: false,
      item: menuItemData,
      menuGroups: [],
      response: {},
      modalTitle: "",
      headers: [
        { text: "Icon", value: "icon" },
        { text: "Name", value: "name" },
        { text: "Code", value: "code" },
        { text: "State", value: "state" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      items: dataItems,
      formData: menuItemData,
      rows: ["10", "20", "30", "40", "50", "100"],
    });

    onMounted(() => {
      get(TYPE, { per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.items = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
    });

    const cancelDialog = () => {
      data.formData = {} as MenuItem;
      data.modal = !data.modal;
    };

    const save = () => {
      if (data.formData.id) {
        updateMenuItem(data.formData);
      } else {
        createMenuItem(data.formData);
      }
    };

    const getData = (params: any) => {
      data.response = params;
      get(TYPE, params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openDialog = (formData?: MenuItem) => {
      if (formData && formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
      get("MENU_GROUP", {}).then((response: AxiosResponse) => {
        data.menuGroups = response.data.data.data;
      });
    };

    const updateMenuItem = (data: any) => {
      update(TYPE, data).then((response: AxiosResponse) => {
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const createMenuItem = (data: MenuItem) => {
      create(TYPE, data).then((response: AxiosResponse) => {
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const openConfirmDialog = (item: MenuItem) => {
      data.item = item;
      data.isOpen = true;
    };

    const closeConfirmDialog = () => {
      data.item = {} as MenuItem;
      data.isOpen = false;
    };

    const deleteItem = (item: number | string) => {
      const payload = item;
      deleteEntry(TYPE, payload).then((response: AxiosResponse) => {
        console.log(response);
      });
      data.item = {} as MenuItem;
      data.isOpen = false;
    };

    const navigateToAddPermissions = (item: any) => {
      router.push({ path: `/menu-items/${item.id}/add-permissions` });
    };

    return {
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,

      getData,

      updateMenuItem,
      save,
      deleteItem,
      navigateToAddPermissions,
    };
  },
});
</script>
