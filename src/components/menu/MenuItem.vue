<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="cant('create', 'AuthMenuItem')">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table :headers="data.headers" :items="items" disable-pagination hide-default-footer class="elevation-1">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)" :disabled="cant('edit', 'AuthMenuItem')">
            mdi-pencil-box-outline
          </v-icon>
          <v-icon @click="openConfirmDialog(item)" :disabled="cant('delete', 'AuthMenuItem')">
            mdi-trash-can-outline
          </v-icon>
          <v-btn
            color="blue darken-1"
            text
            @click="openPermissionDialog(item)"
            :disabled="cant('addPermissions', 'AuthMenuItem')"
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

    <Modal :modal="data.permissionDialog" :width="650">
      <template v-slot:header>
        <ModalHeader :title="`Add Permissions to Menu Item`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-card-actions class="pa-0">
            <h2 class="mr-7 ml-3" v-if="data.menu">{{ data.menu.name }} Menu Item</h2>
          </v-card-actions>
          <v-row>
            <v-col cols="12" lg="12" md="12" sm="12">
              <v-autocomplete
                v-model="data.selectedCategory"
                :loading="data.loading"
                :items="data.categoryOptions"
                :search-input.sync="data.search"
                item-text="category"
                @change="getPermissions"
                cache-items
                class="mr-7 ml-2"
                flat
                hide-no-data
                hide-details
                return-object
                color="white"
                label="Search Resource name"
                solo-inverted
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" lg="12" md="12" sm="12">
              <PermissionList
                v-if="data.category"
                :item="data.category"
                :columnName="'permissions'"
                :selected="data.selected"
                @itemSelected="addToSelection"
              />
            </v-col>
          </v-row>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelPermissionDialog">Cancel</v-btn>
          <v-btn color="primary darken-1" text @click="addPermissions"> Save </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import router from "@/router";
import {
  get,
  create,
  update,
  deleteEntry,
  find,
  getResourceCategories,
  getPermissionsByResource,
  addPermissions as assignPermissions,
} from "./services/menu.service";
import PermissionList from "@/components/role/PermissionList.vue";
import { MenuItem } from "./types/MenuItem";

export default defineComponent({
  components: {
    PermissionList,
  },
  setup() {
    const TYPE = "MENU_ITEM";
    let dataItems: Array<MenuItem> = [];
    let menuItemData = {} as MenuItem;
    let data = reactive({
      title: "Manage Menu Items",
      valid: true,
      isOpen: false,
      permissionDialog: false,
      item: menuItemData,
      menuGroups: [],
      response: {},
      modalTitle: "",
      headers: [
        { text: "Icon", value: "icon" },
        { text: "Name", value: "name" },
        { text: "Code", value: "code" },
        { text: "State", value: "state" },
        { text: "Menu Group", value: "group" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      items: dataItems,
      formData: menuItemData,
      rows: ["10", "20", "30", "40", "50", "100"],
      // properties for permission dialog
      menu: null,
      loading: false,
      categories: [],
      category: null,
      selected: [],
      selectedCategory: "",
      categoryOptions: [],
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

    const addPermissions = () => {
      let payload = {
        menu_id: data.menu.id,
        permissions: data.selected.map((val) => val.id),
      };

      assignPermissions(payload).then((response: AxiosResponse) => {
        if (response.status == 200) {
          data.permissionDialog = false;
        }
      });
    };

    const openPermissionDialog = (item) => {
      data.menu = item;
      data.permissionDialog = true;

      const menuID: any = item.id;
      find(menuID, TYPE).then((response: AxiosResponse) => {
        data.menu = response.data.data;
        data.selected = response.data.data.permisions;
        response.data.data.permisions.length > 0
          ? (data.selectedCategory = response.data.data.permisions[0].resource)
          : (data.selectedCategory = "");
      });

      getResourceCategories({ categories: true }).then((response: AxiosResponse) => {
        data.categories = response.data.data;
        data.categoryOptions = response.data.data.map((entry) => {
          return entry.category;
        });
      });
    };

    const getPermissions = (val) => {
      let { id, category } = data.categories.find((cat) => cat.category === val);
      data.selectedCategory = category;
      getPermissionsByResource(id, category).then((response) => {
        data.category = response.data.data;
      });
    };

    const addToSelection = (item: any) => {
      let idx = data.selected.indexOf(item);
      if (idx > -1) {
        data.selected.splice(idx, 1);
      } else {
        data.selected.push(item);
      }
    };

    let selectedCategory = computed(() => {
      return data.selectedCategory;
    });

    let categories = computed(() => {
      return data.categories;
    });

    const items = computed(() => {
      return data.items.map((item: any) => ({
        ...item,
        group: item.group ? `[ ${item.group.name} ]` : ["NO GROUP"],
      }));
    });

    watch([selectedCategory, data.categories], (newValue) => {
      let [selected] = newValue;
      if (data.categories.length > 0 && !!selected) {
        let { id, category } = data.categories.find((c) => c.category == selected);
        data.selectedCategory = category;
        getPermissionsByResource(id, category).then((response) => {
          data.category = response.data.data;
        });
      }
    });

    const cancelPermissionDialog = () => {
      data.menu = null;
      data.permissionDialog = !data.permissionDialog;
    };

    return {
      data,
      items,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      openPermissionDialog,

      getData,

      updateMenuItem,
      save,
      deleteItem,

      addPermissions,
      getPermissions,
      addToSelection,
      cancelPermissionDialog,
    };
  },
});
</script>
