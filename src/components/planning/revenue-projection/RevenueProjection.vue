<template>
  <div class="Revenue Projection">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        hide-default-footer
        class="elevation-1"
        disable-pagination
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
              <v-col cols="4" sm="12" md="5" class="pl-4 pt-6">
                <v-autocomplete
                  label="Select Financial year"
                  @change="selectFinancialYear($event)"
                  :items="data.financialYearData"
                  :item-text="'name'"
                  :item-divider="true"
                  return-object
                  required
                  outlined
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="6" sm="12" md="4" class="pr-4 pt-6">
                <v-autocomplete
                  label="Filter by Funding Source Code"
                  @change="searchItem($event)"
                  :items="data.itemsToFilter"
                  :item-text="'funding_source_code'"
                  :item-divider="true"
                  return-object
                  required
                  outlined
                  clearable
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-title>
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

    <Modal :modal="data.modal" :width="960">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Revenue Projection`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="data.formData.code"
                    label="Code"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-select
                    v-model="data.formData.project_id"
                    :items="data.projects"
                    item-value="id"
                    label="Project"
                    outlined
                    required
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.code }} - {{ item.description }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.code }} - {{ item.description }}
                    </template>
                    <template v-slot:[`item.amount`]="{ item }">
                      {{ item.amount | toCurrency() }}
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            v-model="data.searchTerm"
                            outlined
                            placeholder="Search"
                            @input="searchProjects"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="5">
                  <v-select
                    v-model="data.formData.sub_budget_class_id"
                    :items="data.subBudgetClasses"
                    item-value="id"
                    outlined
                    label="Sub budget class"
                    required
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.code }} - {{ item.description }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.code }} - {{ item.description }}
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            outlined
                            v-model="data.searchTerm"
                            placeholder="Search"
                            @input="searchSubBudgetClasses"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
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
          <v-btn color="green darken-1" text @click="save">
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Revenue Projection `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRevenueProjection } from "./composables/revenue-projection";

export default defineComponent({
  name: "RevenueProjection",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateRevenueProjection,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      selectFinancialYear,
    } = useRevenueProjection();

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateRevenueProjection,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      selectFinancialYear,
    };
  },
});
</script>

<style scoped></style>
