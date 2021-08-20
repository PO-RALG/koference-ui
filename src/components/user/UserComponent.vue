<template>
  <div class="academic-year">
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
        :server-items-length="data.params.total"
        :options.sync="data.pagination"
        :items-per-page="data.params.size"
        class="elevation-1"
      >
        <template v-slot:item.startDate="{ item }">
          <span>{{ item.startDate }}</span>
        </template>
        <template v-slot:item.endDate="{ item }">
          <span>{{ item.endDate }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
          <v-icon @click="deleteItem(item.id)">mdi-trash-can-outline</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <Modal :isOpen="data.isOpen" :width="600">
      <template v-slot:header>
        <ModalHeader :title="'Create User'" />
      </template>
      <template v-slot:body>
        <ModalBody>Modal Body</ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
        <v-btn color="blue darken-1" text  >Save </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { USER_DATA } from "../../config/users";

export default defineComponent({
  setup() {
    let dataItems: Array<any> = [];
    let data = reactive({
      title: "Manage Users",
      headers: [
        { text: "CHECK NUMBER", value: "check_number" },
        { text: "Phone Number", value: "phone_number" },
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Email", value: "email" },
        { text: "Roles", value: "roles" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      isOpen: false,
      items: dataItems,
      formData: {},
      params: {
        total: 100,
        size: 10,
      },
    });

    onMounted(() => {
      data.items = USER_DATA;
    });

    const deleteAcademicYear = () => {
      console.log("delete year");
    };

    const openDialog = (formData?: any) => {
      console.log("form data", formData);
      data.isOpen = !data.isOpen;
    };

    return {
      data,

      openDialog,
      deleteAcademicYear,
    };
  },
});
</script>

<style scoped></style>
