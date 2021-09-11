<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="cant('create', 'AuthMenuGroup')">
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
        <template v-slot:body="props">
          <draggable :list="props.items" tag="tbody" @change="updatePosition">
            <tr v-for="(group, index) in props.items" :key="index">
              <td>
                <v-icon small class="page__grab-icon">mdi-arrow-all</v-icon>
              </td>
              <td>{{ index + 1 }}</td>
              <td><v-icon small>{{ group.icon }}</v-icon></td>
              <td>{{ group.position }}</td>
              <td>{{ group.name }}</td>
            <td>
              <v-icon class="mr-2" @click="openDialog(group)" :disabled="cant('edit', 'AuthMenuGroup')">
                mdi-pencil-box-outline
              </v-icon>
              <v-icon @click="openConfirmDialog(group)" :disabled="cant('delete', 'AuthMenuGroup')">
                mdi-trash-can-outline
              </v-icon>
            </td>
            </tr>
          </draggable>
        </template>
        <template v-slot:[`item.icon`]="{ item }">
          <v-icon class="mr-2">{{ item.icon }}</v-icon>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Menu Group`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="3" md="3" sm="12">
                  <v-text-field label="Icon" v-model="data.formData.icon" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="3" md="3" sm="12">
                  <v-text-field label="Menu Order" v-model="data.formData.position" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field label="Name" v-model="data.formData.name" required> </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-text-field label="URL" v-model="data.formData.link" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-select
                    v-model="data.formData.parent_id"
                    item-text="name"
                    :items="data.items"
                    label="Select Group Parent"
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
      :message="'Are you sure you want to delete this menu group?'"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="'Delete Menu Group'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import draggable from "vuedraggable";
import { get, create, update, deleteEntry } from "./services/menu.service";
import { MenuGroup } from "./types/MenuGroup";

export default defineComponent({
  components: {
    draggable,
  },
  setup() {
    const TYPE = "MENU_GROUP";
    let dataItems: Array<MenuGroup> = [];
    let menuGroupData = {} as MenuGroup;
    let data = reactive({
      title: "Manage Menu Groups",
      valid: true,
      isOpen: false,
      item: menuGroupData,
      response: {},
      modalTitle: "",
      headers: [
        { text: "", sortable: false },
        { text: "#", sortable: false },
        { text: "Icon", value: "icon" },
        { text: "Position", value: "position" },
        { text: "Name", value: "name" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      items: dataItems,
      formData: menuGroupData,
      rows: ["10", "20", "30", "40", "50", "100"],
    });

    onMounted(() => {
      get(TYPE, {}).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.items = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
    });

    const cancelDialog = () => {
      data.formData = {} as MenuGroup;
      data.modal = !data.modal;
    };

    const save = () => {
      if (data.formData.id) {
        updateMenuGroup(data.formData);
      } else {
        createMenuGroup(data.formData);
      }
    };

    const getData = (params: any) => {
      data.response = params;
      get(TYPE, params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openDialog = (formData?: MenuGroup) => {
      if (formData && formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateMenuGroup = (data: any) => {
      update(TYPE, data).then((response: AxiosResponse) => {
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const createMenuGroup = (data: MenuGroup) => {
      create(TYPE, data).then((response: AxiosResponse) => {
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const openConfirmDialog = (item: MenuGroup) => {
      data.item = item;
      data.isOpen = true;
    };

    const closeConfirmDialog = () => {
      data.item = {} as MenuGroup;
      data.isOpen = false;
    };

    const deleteItem = (item: number | string) => {
      const payload = item;
      deleteEntry(TYPE, payload).then((response: AxiosResponse) => {
        console.log(response);
      });
      data.item = {} as MenuGroup;
      data.isOpen = false;
    };

    const updatePosition = (item: any) => {
      let { newIndex, element } = item.moved;
      element.position = newIndex + 1;
      update(TYPE, element);
    };

    return {
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,

      getData,

      updateMenuGroup,
      save,
      deleteItem,
      updatePosition,
    };
  },
});
</script>

<style lang="scss" scoped>
.page__grab-icon {
  cursor: move;
}
</style>
