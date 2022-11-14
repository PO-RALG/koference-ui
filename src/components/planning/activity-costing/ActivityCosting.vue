<template>
  <div class="Activity Costing">
    <v-card-actions :class="headerPadding">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="printActivityCosting()"> Print </v-btn>
    </v-card-actions>
    <v-card :class="cardPadding">
      <v-divider></v-divider>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        hide-default-footer
        :class="elevation"
        disable-pagination
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="3" class="pa-5">
              <v-autocomplete
                outlined
                prepend-inner-icon="mdi-filter-outline"
                label="Filter Financial Year"
                @change="searchItemByFYear($event)"
                @click:clear="resetSearchText()"
                :items="data.financialYearToFilter"
                :item-text="'name'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="6" sm="12" md="3" class="pa-0">
              <v-text-field
                prepend-inner-icon="mdi-filter-outline"
                outlined
                label="Filter By Activity Code"
                @keyup="filterActivity()"
                :items="data.itemsToFilter"
                v-model="data.searchTerm"
                @click:clear="resetSearchText()"
                clearable
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
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
        <ModalHeader :title="`${data.modalTitle} Activity Costing`" />
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
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            v-model="data.searchTerm"
                            placeholder="Search"
                            outlined
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
                    label="Sub budget class"
                    required
                    outlined
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
                            v-model="data.searchTerm"
                            placeholder="Search"
                            outlined
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
        <ModalHeader :title="`Delete Activity `" />
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
import { useActivityCosting } from "./composables/activity-costing";

export default defineComponent({
  name: "ActivityCosting",
  props: {
    headerPadding: {
      type: String,
      required: false,
      default: "pa-0",
    },
    cardPadding: {
      type: String,
      required: false,
      default: "pa-0",
    },
    elevation: {
      type: String,
      required: false,
      default: "elevation-2",
    },
  },
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateActivityCosting,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      searchItemByFYear,
      resetSearchText,
      filterActivity,
      printActivityCosting,
    } = useActivityCosting();

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateActivityCosting,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      searchItemByFYear,
      resetSearchText,
      filterActivity,
      printActivityCosting,
    };
  },
});
</script>

<style scoped></style>
