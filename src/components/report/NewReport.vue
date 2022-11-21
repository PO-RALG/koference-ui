<template>
  <div class="Facility">
    <v-card-actions class="pt-5 pr-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'Report')"
      >
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
        <template v-slot:[`item.activations`]="{ item }">
          <v-switch
            :input-value="item.active"
            @click.native.stop
            v-model="item.active"
            @change="openActivationDialog(item)"
            value
          >
          </v-switch>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            v-if="can('writeQuery', 'Report') && item.query"
            class="mr-2"
            @click="openCodeEditor(item)"
          >
            mdi-code-tags
          </v-icon>
          <v-icon
            class="mr-2"
            @click="openDialog(item)"
            :disabled="cant('edit', 'Report')"
          >
            mdi-pencil-box-outline
          </v-icon>
          <v-icon
            @click="openConfirmDialog(item.id)"
            :disabled="cant('delete', 'Report')"
          >
            mdi-trash-can-outline
          </v-icon>
        </template>
        <template v-slot:footer>
          <Paginate
            :params="data.params"
            :rows="data.rows"
            @onPageChange="loadReports"
          />
        </template>
      </v-data-table>
    </v-card>
    <ConfirmDialog
      @rejectFunction="closeActivationDialog"
      @acceptFunction="toggleStatus"
      :message="message"
      :data="data.item"
      :isOpen="data.show"
      :title="`${data.status} Report`"
    />
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
                  <v-select
                    v-model="data.formData.order"
                    :items="data.reportOrders"
                    label="Report Order"
                    outlined
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="8" sm="6">
                  <v-text-field
                    v-model="data.formData.name"
                    label="Report Name"
                    outlined
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12" class="mt-n8">
                  <v-text-field
                    v-model="data.formData.template_uri"
                    outlined
                    label="Template URI"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" class="mt-n8 mb-n8">
                  <fetcher :api="'/api/v1/admin-area-levels'">
                    <div slot-scope="{ json: levels, loading }">
                      <div v-if="loading">Loading...</div>
                      <v-select
                        v-else
                        v-model="data.formData.level_id"
                        :items="levels"
                        item-value="id"
                        label="Report Level"
                        outlined
                        required
                      >
                        <template v-slot:selection="{ item }">{{
                          item.name
                        }}</template>
                        <template v-slot:item="{ item }">{{
                          item.name
                        }}</template>
                      </v-select>
                    </div>
                  </fetcher>
                </v-col>
                <v-col cols="12" md="6" class="mt-n8 mb-n8">
                  <v-select
                    v-model="data.formData.parent_id"
                    :items="data.entries"
                    item-value="id"
                    label="Report Parent"
                    outlined
                    required
                  >
                    <template v-slot:selection="{ item }">{{
                      item.name
                    }}</template>
                    <template v-slot:item="{ item }">{{ item.name }}</template>
                  </v-select>
                </v-col>

                <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                  <DualMultiSelect
                    :source="data.reportFilters"
                    :destination="data.selectedFilters"
                    v-model="data.formData.report_parameters"
                    :label="'name'"
                    :modelName="'filters'"
                    @onChangeList="onChangeList"
                  />
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

    <Modal :modal="data.deleteModal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Report `" />
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

    <Modal :modal="data.editQuery" :width="1200">
      <template v-slot:header>
        <ModalHeader :showTitleBg="false" :title="reportTitle" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <AceEditor
            v-if="data.selectedReport"
            :fontSize="20"
            :showPrintMargin="true"
            :showGutter="true"
            :highlightActiveLine="true"
            width="auto%"
            height="600px"
            v-model="data.selectedReport.query"
            mode="sql"
            theme="github"
            name="editor"
            tabindex="0"
            :onChange="onChange"
            @keydown.ctrl.83.prevent.stop="saveReportQuery"
            @keyup.ctrl.83.prevent.stop="saveReportQuery"
            @keyup.alt.83.prevent.stop="saveReportQuery"
            :editorProps="{ $blockScrolling: true }"
          />
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="closeCodeEditor"
            >Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="saveReportQuery"
            >Yes</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useNewReport } from "./composables/use-new-report";

import brace from "brace";
import { Ace as AceEditor, Split as SplitEditor } from "vue2-brace-editor";
// import "brace/mode/sql";
// import "brace/theme/github";

export default defineComponent({
  name: "NewReport",
  components: {
    AceEditor,
    SplitEditor,
  },
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
      saveReportQuery,
      reportTitle,
      onChange,
      onChangeList,
      selectedFilters,
      openActivationDialog,
      closeActivationDialog,
      toggleStatus,
      message,
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
      saveReportQuery,
      reportTitle,
      onChange,
      onChangeList,
      selectedFilters,
      openActivationDialog,
      closeActivationDialog,
      toggleStatus,
      message,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
.ace_content {
  padding: 20px !important;
  overflow: hidden;
}
</style>
