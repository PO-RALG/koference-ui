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
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)">
            mdi-pencil-box-outline
          </v-icon>
          <v-icon @click="openConfirmDialog(item)">
            mdi-trash-can-outline
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} User`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field
                    label="First Name"
                    v-model="data.formData.first_name"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field
                    label="Midde Name"
                    v-model="data.formData.middle_name"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field
                    label="Last Name"
                    v-model="data.formData.last_name"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="data.formData.email"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                  <v-text-field
                    label="Phone Number"
                    v-model="data.formData.phone_number"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                  <v-text-field
                    label="Check Number"
                    v-model="data.formData.check_number"
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">{{ data.modalTitle }} </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { USER_DATA } from "../../config/users";
import { get, create, update } from "./services/user.service";

export default defineComponent({
  setup() {
    let dataItems: Array<any> = [];
    let formData: any = {};
    let data = reactive({
      title: "Manage Users",
      modalTitle: "",
      headers: [
        { text: "Check Number", value: "check_number" },
        { text: "Phone Number", value: "phone_number" },
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Email", value: "email" },
        { text: "Roles", value: "roles" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      items: dataItems,
      formData,
      params: {
        total: 100,
        size: 10,
      },
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    });

    onMounted(() => {
      // make api call
      // get().then((response: any) => {
        // data.items = response.data;
      // });
      data.items = USER_DATA;
    });

    const deleteAcademicYear = () => {
      console.log("delete year");
    };

    const cancelDialog = () => {
      data.formData = {};
      data.modal = !data.modal;
    };

    const save = () => {
      console.log(data.formData);
      if (data.formData.id) {
        updateUser(data.formData);
      } else {
        createUser(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateUser = (data: any) => {
      update(data);
    };

    const createUser = (data: any) => {
      create(data);
    };

    return {
      data,

      openDialog,
      cancelDialog,
      deleteAcademicYear,

      updateUser,
      save,
    };
  },
});
</script>

<style scoped></style>
