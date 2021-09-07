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
      <v-data-table :headers="data.headers" :items="users" hide-default-footer class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
          <v-icon @click="openConfirmDialog(item)"> mdi-trash-can-outline </v-icon>
        </template>
      </v-data-table>
      <Paginate :params="data.response" :rows="data.rows" @onPageChange="getData" />
    </v-card>
    <Modal :modal="data.modal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} User`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-form ref="form" v-model="data.valid">
            <v-container>
              <v-row>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="First Name" v-model="data.formData.first_name" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="Midde Name" v-model="data.formData.middle_name" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12">
                  <v-text-field label="Last Name" v-model="data.formData.last_name" required> </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                  <v-text-field label="Email Address" v-model="data.formData.email" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                  <v-text-field label="Phone Number" v-model="data.formData.phone_number" required> </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" class="mt-n8">
                  <v-text-field label="Check Number" v-model="data.formData.check_number" required> </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
                  <DualMultiSelect
                    :items="data.roles"
                    :label="'Filter Roles'"
                    :title="'Add Roles'"
                    v-model="data.formData.roles"
                 />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12" class="hierarchy-container">
                  <v-label>
                    <h5 class="tree-title">SELECT USER LOCATION</h5>
                  </v-label>
                  <TreeBrowser
                    v-if="data.node"
                    @onClick="loadLocationChildren"
                    v-model="data.formData.location"
                    :node="data.node"
                 />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter class="mt-n8">
          <v-btn color="blue darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
    <ConfirmDialog
      @rejectFunction="closeConfirmDialog"
      @acceptFunction="deleteItem"
      :message="'Are you sure you want to delete this user?'"
      :data="data.item"
      :isOpen="data.isOpen"
      :title="'Delete User'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, set, computed } from "@vue/composition-api";
import { get, create, update, deleteUser } from "./services/user.service";
import { getChildren } from "@/components/admin-area/admin-area/services/admin-area-services";
import { get as getRoles } from "@/components/role/services/role-services";
import { AxiosResponse } from "axios";
import { User } from "./types/User";
import { Role } from "@/components/role/types/Role";

export default defineComponent({
  setup() {
    let dataItems: Array<User> = [];
    let roleItems: Array<Role> = [];
    let userData = {} as User;
    let data = reactive({
      title: "Manage Users",
      valid: true,
      isOpen: false,
      node: null,
      item: userData,
      response: {},
      roles: roleItems,
      modalTitle: "",
      headers: [
        { text: "Check Number", value: "check_number" },
        { text: "Phone Number", value: "phone_number" },
        { text: "Name", align: "start", sortable: false, value: "fullName" },
        { text: "Email", value: "email" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      items: dataItems,
      formData: userData,
      rows: ["5", "10", "15"],
      params: {
        total: 100,
        size: 10,
      },
      nameRules: [
        (v: string) => !!v || "Name is required",
        (v: string) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      email: "",
      emailRules: [
        (v: string) => !!v || "E-mail is required",
        (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    });

    onMounted(() => {
      get({}).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.items = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
      getNodes();
    });

    const cancelDialog = () => {
      data.formData = {} as User;
      data.modal = !data.modal;
    };

    const save = () => {
      let roles = data.formData.roles.map(role => role.id);
      data.formData["roles"] = roles;
      if (data.formData.id) {
        updateUser(data.formData);
      } else {
        createUser(data.formData);
      }
    };

    const users = computed(() => {
      return data.items.map((user) => ({
        ...user,
        fullName: `${user.first_name} ${user.middle_name}  ${user.last_name}`,
      }));
    });

    const getData = (params: any) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openDialog = (formData?: User) => {
      if (formData && formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
      loadRoles();
    };

    const updateUser = (data: User) => {
      update(data).then((response: AxiosResponse) => {
        console.log(response.status);
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const createUser = (data: User) => {
      create(data).then((response: AxiosResponse) => {
        if (response.status === 200) {
          cancelDialog();
        }
      });
    };

    const openConfirmDialog = (item: User) => {
      data.item = item;
      data.isOpen = true;
    };

    const closeConfirmDialog = () => {
      data.item = {} as User;
      data.isOpen = false;
    };

    const deleteItem = (item: number | string) => {
      const payload = item;
      deleteUser(payload).then((response: AxiosResponse) => {
        console.log(response);
      });
      data.item = {} as User;
      data.isOpen = false;
    };

    const loadLocationChildren = (location: any) => {
      data.formData.location_id = location.id;
      if (!location.children) {
        if (location.id !== data.node.id) {
          getChildren(location.id).then((response: AxiosResponse) => {
            if (response.data.data.children.length) {
              set(location, "children", response.data.data.children);
            }
          });
        }
      }
    };

    const getNodes = (id?: number | string) => {
      getChildren(id).then((response: AxiosResponse) => {
        data.node = response.data.data;
      });
    };

    const loadRoles = () => {
      getRoles({}).then((response: AxiosResponse) => {
        data.roles = response.data.data.data;
      });
    };

    return {
      data,

      openDialog,
      cancelDialog,
      closeConfirmDialog,
      openConfirmDialog,

      loadLocationChildren,
      getNodes,
      getData,
      users,

      updateUser,
      save,
      deleteItem,
    };
  },
});
</script>

<style scoped>
.tree-title {
  padding: 0 0 5px 0;
}
</style>
