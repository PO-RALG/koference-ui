<template>
  <div class="Facility">
    <v-card-actions class="pt-5 pr-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="cant('create', 'Report')">
        <v-icon>mdi-plus</v-icon>
        Add Report
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.entries"
        hide-default-footer
        class="elevation-1"
        disable-pagination
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Name"
                @change="searchItem($event)"
                :items="data.itemsToFilter"
                :item-text="'name'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
          </v-card-title>
        </template>

        <template v-slot:[`item.level`]="{ item }">
          <span v-if="item.level">{{ item.level.name }} </span>
          <span v-else> No Level</span>
        </template>

        <template v-slot:[`item.parent`]="{ item }">
          <span v-if="item.parent"> {{ item.parent.name }} </span>
          <span v-else>-</span>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon v-if="item.query" class="mr-2" @click="openCodeEditor(item)" :disabled="cant('edit', 'Report')">
            mdi-code-tags
          </v-icon>
          <v-icon class="mr-2" @click="openDialog(item)" :disabled="cant('edit', 'Report')">
            mdi-pencil-box-outline
          </v-icon>
          <v-icon @click="openConfirmDialog(item.id)" :disabled="cant('delete', 'Report')">
            mdi-trash-can-outline
          </v-icon>
        </template>
        <template v-slot:footer>
          <Paginate :params="data.params" :rows="data.rows" @onPageChange="loadReports" />
        </template>
      </v-data-table>
    </v-card>

    <Modal :modal="data.modal" :width="760">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Report`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-select v-model="data.formData.order" :items="data.reportOrders" label="Report Order" required>
                  </v-select>
                </v-col>
                <v-col cols="12" md="8" sm="6">
                  <v-text-field v-model="data.formData.name" label="Report Name" required></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field v-model="data.formData.template_uri" label="Template URI"></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <fetcher :api="'/api/v1/admin-area-levels'">
                    <div slot-scope="{ json: levels, loading }">
                      <div v-if="loading">Loading...</div>
                      <v-select
                        v-else
                        v-model="data.formData.level_id"
                        :items="levels"
                        item-value="id"
                        label="Report Level"
                        required
                      >
                        <template v-slot:selection="{ item }">{{ item.name }}</template>
                        <template v-slot:item="{ item }">{{ item.name }}</template>
                      </v-select>
                    </div>
                  </fetcher>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="data.formData.parent_id"
                    :items="data.entries"
                    item-value="id"
                    label="Report Parent"
                    required
                  >
                    <template v-slot:selection="{ item }">{{ item.name }}</template>
                    <template v-slot:item="{ item }">{{ item.name }}</template>
                  </v-select>
                </v-col>
              </v-row>
            </v-container>
            <!--<pre>{{ data.formData }}</pre>-->
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

    <Modal :modal="data.deleteModal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Report `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog"> Cancel </v-btn>
          <v-btn color="green darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.editQuery" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`Edit Query`" />
      </template>
      <template v-slot:body>
        <ModalBody>
        <div>Editor</div>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="closeCodeEditor">Cancel </v-btn>
          <v-btn color="green darken-1" text @click="save">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useNewReport } from "./composables/use-new-report";

export default defineComponent({
  name: "NewReport",
  setup() {
    const {
      data,
      openDialog,
      openConfirmDialog,
      cancelDialog,
      save,
      remove,
      loadReports,
      cancelConfirmDialog,
      openCodeEditor,
      closeCodeEditor,
    } = useNewReport();

    return {
      data,
      openDialog,
      openConfirmDialog,
      cancelDialog,
      save,
      loadReports,
      remove,
      cancelConfirmDialog,
      openCodeEditor,
      closeCodeEditor,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
