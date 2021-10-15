<template>
  <div class="gl-accounts">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog" :disabled="cant('create', 'GLAccount')">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table :headers="HEADERS" :items="data.items" hide-default-footer class="elevation-1">
        <template v-slot:[`item.active`]="{ item }">
          <v-icon v-if="item.active" medium color="success">mdi-check</v-icon>
          <v-icon v-else medium color="warning">mdi-close</v-icon>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-switch :input-value="item.active" @change="openActivationDialog(item)" value></v-switch>
        </template>
        <template v-slot:footer> </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} GL Account`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field v-model="data.formData.code" label="Code" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="save">{{ data.modalTitle }} </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useGLAccount } from "./composables/gl-account";

export default defineComponent({
  setup() {
    const HEADERS = [
      { text: "Account Type", value: "gl_account_type" },
      { text: "Account", value: "code" },
      { text: "Status", align: "start", sortable: false, value: "active" },
      { text: "Actions", value: "actions", sortable: false },
    ];

    const {
      data,
      toggleStatus,
      openActivationDialog,
      cancelActivationDialog,
      openDialog,
      cancelDialog,
      save,
    } = useGLAccount();

    return {
      HEADERS,
      data,
      toggleStatus,
      openActivationDialog,
      cancelActivationDialog,
      openDialog,
      cancelDialog,
      save,
    };
  },
});
</script>
