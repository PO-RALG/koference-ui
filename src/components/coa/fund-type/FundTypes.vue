<template>
  <div class="fund-types">
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
        class="elevation-1"
        item-key="id"
        :single-expand="true"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-text-field
                @input="searchCategory($event)"
                class
                clearable
                flat
                hide-details
                prepend-icon="mdi-magnify"
                label="Search by Name"
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.description }}</td>
            <td>{{ item.current_code }}</td>
            <td>{{ item.carryover_code }}</td>
          </tr>
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
        <ModalHeader :title="`${data.modalTitle} Fund Types`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
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
        <ModalHeader :title="`Delete Fund Types `" />
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
import { useFundType } from "./composables/fund-type";

export default defineComponent({
  name: "FundTypes",
  setup() {
    const {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteFundType,
      updateFundType,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
    } = useFundType();

    return {
      data,
      getData,
      openDialog,
      cancelDialog,
      deleteFundType,
      updateFundType,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
    };
  },
});
</script>

<style scoped></style>
