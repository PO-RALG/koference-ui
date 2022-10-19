<template>
  <div class="Activity">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="save"
        :disabled="cant('create', 'Activity')"
      >
        <v-icon>mdi-sync</v-icon>
        Update From PlanRep
      </v-btn>
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
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Code"
                @change="searchItem($event)"
                :items="data.itemsToFilter"
                :item-text="'code'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
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

    <Modal :modal="data.modal">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Activity`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field
                    v-model="data.formData.code"
                    label="Code"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" sm="12">
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
                <v-col cols="12" md="12" sm="12">
                  <v-select
                    outlined
                    v-model="data.formData.sub_budget_class_id"
                    :items="data.subBudgetClasses"
                    item-value="id"
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
                    outlined
                    label="Description"
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
import { defineComponent } from "@vue/composition-api";
import { useActivity } from "./composables/activity";

export default defineComponent({
  name: "Activity",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      getProjectData,
      updateActivity,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      getSubBudgetClassData,
      searchProjects,
      searchSubBudgetClasses,
    } = useActivity();

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      getProjectData,
      updateActivity,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      getSubBudgetClassData,
      searchProjects,
      searchSubBudgetClasses,
    };
  },
});
</script>

<style scoped></style>
