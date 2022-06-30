<template>
  <div class="meta-data-category">
    <v-card-actions class="pa-0">
      <h2>Manage GFS Categories</h2>
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
        class="elevation-1"
        item-key="id"
        :expanded.sync="data.expanded"
        :single-expand="true"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-text-field
                outlined
                label="Filter Gfs category"
                @keyup="filterGfscategory()"
                :items="data.itemsToFilter"
                v-model="data.searchTerm"
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:item="{ item, isExpanded, expand }">
          <tr>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                    @click="expand(!isExpanded)"
                  >
                    mdi-chevron-down
                  </v-icon>
                </template>
                <span>List of Gfs codes</span>
              </v-tooltip>
            </td>
            <td>{{ item.description }}</td>
            <td>{{ item.account_nature }}</td>
            <td>{{ item.account_type }}</td>
            <td>
              <v-icon class="mr-2" @click="openDialog(item)">
                mdi-pencil-box-outline
              </v-icon>
              <v-icon @click="deleteGfsCategory(item.id)">
                mdi-trash-can-outline
              </v-icon>
            </td>
          </tr>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pb-5 pa-3">
            <b>CATEGORY:</b>
            {{ item.description }} ({{ item.code }})
            <v-card outlined flat max-width="100%">
              <v-data-table
                :headers="data.gfsCodes"
                :items="item.gfs_codes"
                hide-default-footer
                dense
              ></v-data-table>
            </v-card>
          </td>
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
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} GfsCode Category`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="data.formData.code"
                    label="Code"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n8">
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-select
                    v-model="data.formData.account_type"
                    item-text="name"
                    :items="data.ACCOUNT_TYPES"
                    item-value="name"
                    outlined
                    label="Select Account Type"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                  <v-select
                    v-model="data.formData.account_nature"
                    item-text="name"
                    :items="data.ACCOUNT_NATURE"
                    item-value="name"
                    label="Select Account Nature"
                    outlined
                  >
                  </v-select>
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
        <ModalHeader :title="`Delete GfsCodes `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="green darken-1" text @click="cancelConfirmDialog"
            >Cancel</v-btn
          >
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useGfsCategory } from "./composables/gfs-category";

export default defineComponent({
  name: "GfsCategories",
  setup() {
    const {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteGfsCategory,
      getGfsCategory,
      updateGfsCategory,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      imageUrl,
      filterGfscategory,
      resetSearchText,
    } = useGfsCategory();

    return {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteGfsCategory,
      getGfsCategory,
      updateGfsCategory,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      imageUrl,
      filterGfscategory,
      resetSearchText,
    };
  },
});
</script>

<style scoped></style>
