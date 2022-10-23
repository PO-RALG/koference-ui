<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ TITLE }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'AuthMenuItem')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table
        :headers="HEADERS"
        :items="items"
        disable-pagination
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-row
              cols-lg="4"
              cols-md="12"
              cols-sm="12"
              align="center"
              class="d-flex justify-end align-center"
            >
              <v-col cols="12" sm="12" md="6" class="pt-11">
                <fetcher :api="`/api/v1/menu-groups`">
                  <div slot-scope="{ json: items, loading }">
                    <div v-if="loading">Loading Menus...</div>
                    <v-select
                      v-model="data.facilityType"
                      :item-text="'name'"
                      label="Filter By Groups"
                      :items="items"
                      @change="loadByMenuGroups"
                      return-object
                      outlined
                    ></v-select>
                  </div>
                </fetcher>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <SearchField
                  label="Search Menu Items"
                  v-model="data.searchTerm"
                  @filterFunction="searchItem"
                  @clearFn="resetSearchText"
                />
              </v-col>
            </v-row>
          </v-card-title>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="mr-2"
            @click="openDialog(item)"
            :disabled="cant('edit', 'AuthMenuItem')"
          >
            mdi-pencil-box-outline
          </v-icon>
          <v-icon
            @click="openConfirmDialog(item)"
            :disabled="cant('delete', 'AuthMenuItem')"
          >
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
          <Paginate
            :params="data.response"
            :rows="TABLE_ROWS"
            @onPageChange="getData"
          />
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
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field
                    label="Icon"
                    v-model="data.formData.icon"
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field
                    label="Code"
                    outlined
                    v-model="data.formData.code"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                  <v-text-field
                    label="Name"
                    v-model="data.formData.name"
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n8">
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field
                    label="State"
                    v-model="data.formData.state"
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-select
                    v-model="data.formData.auth_menu_group_id"
                    item-text="name"
                    :items="data.menuGroups"
                    item-value="id"
                    outlined
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
            <h2 class="mr-7 ml-3" v-if="data.menu">
              {{ data.menu.name }} Menu Item
            </h2>
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
          <v-btn color="blue darken-1" text @click="cancelPermissionDialog"
            >Cancel</v-btn
          >
          <v-btn color="primary darken-1" text @click="addPermissions">
            Save
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PermissionList from "@/components/role/PermissionList.vue";
import { useMenuItems } from "./composables/menu-item";

import BaseInput from "@/components/shared/BaseInput.vue";

export default defineComponent({
  components: {
    PermissionList,
    BaseInput,
  },
  setup() {
    const {
      HEADERS,
      TITLE,
      TYPE,
      TABLE_ROWS,

      data,
      items,

      openDialog,
      cancelDialog,
      closeConfirmDialog,

      getData,

      deleteItem,

      openConfirmDialog,
      openPermissionDialog,
      addPermissions,
      getPermissions,
      addToSelection,
      cancelPermissionDialog,
      save,
      searchItem,
      resetSearchText,
      loadByMenuGroups,
    } = useMenuItems();

    return {
      HEADERS,
      TITLE,
      TYPE,
      TABLE_ROWS,

      data,
      items,

      getData,

      deleteItem,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,
      openPermissionDialog,
      cancelPermissionDialog,

      addPermissions,
      getPermissions,
      addToSelection,

      save,
      searchItem,
      resetSearchText,
      loadByMenuGroups,
    };
  },
});
</script>
