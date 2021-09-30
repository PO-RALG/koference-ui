<template>
  <div class="gl-accounts">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-data-table :headers="HEADERS" :items="data.items" hide-default-footer class="elevation-1">
        <template v-slot:[`item.active`]="{ item }">
          <v-icon v-if="item.active" medium color="success">mdi-check</v-icon>
          <v-icon v-else medium color="warning">mdi-close</v-icon>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-switch
            :input-value="item.active"
            @change="openActivationDialog(item)"
            value
          ></v-switch>
        </template>
        <template v-slot:footer> </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.activateDialog" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`${data.dialogTitle} GLAccount`" />
      </template>
      <template v-slot:body>
        <ModalBody>Are you sure?</ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="green darken-1" text @click="cancelActivationDialog"
            >Cancel</v-btn
          >
          <v-btn color="red darken-1" text @click="toggleStatus">Yes</v-btn>
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

    const { data, toggleStatus, openActivationDialog, cancelActivationDialog } = useGLAccount();

    return {
      HEADERS,
      data,
      toggleStatus,
      openActivationDialog,
      cancelActivationDialog,
    };
  },
});
</script>
