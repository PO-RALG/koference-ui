<template>
  <div>
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'AuthMenuGroup')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>

    <v-card>
      <v-data-table
        :headers="HEADERS"
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
              <td>
                <v-icon small>{{ group.icon }}</v-icon>
              </td>
              <td>{{ group.position }}</td>
              <td>{{ group.name }}</td>
              <td>
                <v-icon
                  class="mr-2"
                  @click="openDialog(group)"
                  :disabled="cant('edit', 'AuthMenuGroup')"
                >
                  mdi-pencil-box-outline
                </v-icon>
                <v-icon
                  @click="openConfirmDialog(group)"
                  :disabled="cant('delete', 'AuthMenuGroup')"
                >
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
          <Paginate
            :params="data.response"
            :rows="TABLE_ROWS"
            @onPageChange="getData"
          />
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
                    label="Menu Order"
                    v-model="data.formData.position"
                    outlined
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
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="12" class="mt-n8">
                  <v-text-field
                    label="URL"
                    v-model="data.formData.link"
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" class="mt-n8">
                  <v-select
                    v-model="data.formData.parent_id"
                    item-text="name"
                    :items="data.items"
                    outlined
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
import { defineComponent } from "vue";
import draggable from "vuedraggable";
import { useMenuGroups } from "./composables/menu-group";

export default defineComponent({
  components: {
    draggable,
  },
  setup() {
    const {
      TYPE,
      HEADERS,
      TABLE_ROWS,
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
    } = useMenuGroups();

    return {
      TYPE,
      HEADERS,
      TABLE_ROWS,
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
