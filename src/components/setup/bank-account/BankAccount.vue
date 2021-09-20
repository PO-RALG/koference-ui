<template>
  <div class="bank-accounts">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table :headers="data.headers" :items="data.items" :single-expand="true" class="elevation-1">
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Code"
                @change="searchCategory($event)"
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
        <template v-slot:[`item.startDate`]="{ item }">
          <span>{{ item.startDate }}</span>
        </template>
        <template v-slot:[`item.endDate`]="{ item }">
          <span>{{ item.endDate }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="openDialog(item)"> mdi-pencil-box-outline </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="deleteSubBudgetClass(item.id)">mdi-trash-can-outline</v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <Modal :modal="data.modal" :width="620">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Bank Accounts`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <!-- <img v-show="imageUrl" :src="imageUrl" alt="" /> -->
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="3">
                  <v-text-field v-model="data.formData.branch" label="Branch" required></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field v-model="data.formData.name" label="Name" required></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field v-model="data.formData.bank" label="Bank" required></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field v-model="data.formData.number" label="Number" required></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-autocomplete
                    v-model="data.formData.bank_account_type_id"
                    label="Bank Account Type"
                    :items="data.accounttypes"
                    :item-text="'name'"
                    item-value="id"
                    :item-divider="true"
                    required
                    clearable
                  ></v-autocomplete>
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

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Bank Accounts`" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="green darken-1" text @click="cancelConfirmDialog">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { BackAccount } from "./types/BackAccount";
import { defineComponent, reactive, onMounted } from "@vue/composition-api";

import { get, create, update, destroy, search } from "./services/back-accounts.service";
import { bankaccounttypes } from "../../setup/bank-account-type/services/banck-account-types.service";

export default defineComponent({
  name: "BackAccount",
  setup() {
    let dataItems: Array<BackAccount> = [];
    let documentCategoryData: BackAccount;

    let data = reactive({
      title: "Manage Bank Accounts",
      modalTitle: "",
      headers: [
        {
          text: "GL Account",
          align: "start",
          sortable: false,
          value: "gl_account",
          width: 600,
        },
        {
          text: "Bank",
          align: "start",
          sortable: false,
          value: "bank",
        },
        {
          text: "branch",
          align: "start",
          sortable: false,
          value: "branch",
        },
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },

        {
          text: "Number",
          align: "start",
          sortable: false,
          value: "number",
        },
        {
          text: "Gfs Code",
          align: "start",
          sortable: false,
          value: "gfs_code.name",
        },

        { text: "Actions", value: "actions", sortable: false },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: documentCategoryData,
      params: {
        total: 10,
        size: 10,
      },
      itemtodelete: "",
      accounttypes: [],
      filterdialog: false,

      selectedSbc: [],
      subbudgetclasses: [],
    });

    onMounted(() => {
      initialize();
    });

    const initialize = () => {
      // make api call
      let params: any = {
        total: 10,
        size: 10,
      };
      get(params).then((response: any) => {
        console.log("data to render", response.data.data);
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
      });
      bankaccounttypes().then((response: any) => {
        console.log("gfs codes", response.data.data.data);
        data.accounttypes = response.data.data.data;
      });
    };

    const searchCategory = (categoryName) => {
      console.log("argument", categoryName);

      if (categoryName != null) {
        search({ name: categoryName.name }).then((response: any) => {
          console.log("response data", response);
          data.items = response.data.data.data;
        });
      } else {
        reloadData();
      }
    };

    const reloadData = () => {
      let params: any = {
        total: 10,
        size: 10,
      };
      get(params).then((response: any) => {
        console.log("data", response.data.data);
        data.items = response.data.data.data;
      });
    };

    const deleteSubBudgetClass = (deleteId: any) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
      // console.log("delete year", data);
    };

    const getSubBudgetClass = () => {
      get(data).then((response) => {
        console.log("data", response.data);
      });
    };

    const cancelDialog = () => {
      data.formData = {} as BackAccount;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as BackAccount;
      data.deletemodal = false;
      reloadData();
    };
    const cancelFilterDialog = () => {
      data.filterdialog = false;
      reloadData();
    };

    const remove = () => {
      console.log("delete data with id", data.itemtodelete);
      destroy(data.itemtodelete).then(() => {
        reloadData();
        data.deletemodal = false;
      });
    };

    const save = () => {
      console.log("Form Data", data.formData);
      if (data.formData.id) {
        updateFinancialYear(data.formData);
      } else {
        createUser(data.formData);
      }
    };

    const openDialog = (formData?: any) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as BackAccount;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateFinancialYear = (data: any) => {
      update(data).then((response) => {
        console.log("Updated data", response.data);
        reloadData();
        cancelDialog();
      });
    };

    const createUser = (data: any) => {
      create(data).then((response) => {
        console.log("Created data", response.data);
        reloadData();
        cancelDialog();
      });
    };

    const openFilterDialog = () => {
      data.filterdialog = true;
      data.modal = false;
    };

    const resumeDialog = () => {
      data.modal = true;
      data.filterdialog = false;
    };

    const filterSbc = (term: string) => {
      let result = data.subbudgetclasses.filter((item) => item.code.toLowerCase().includes(term.toLowerCase()));
      data.subbudgetclasses = result;
      return data.subbudgetclasses;
    };

    return {
      filterSbc,
      data,
      openDialog,
      cancelDialog,
      deleteSubBudgetClass,
      getSubBudgetClass,
      updateFinancialYear,
      save,
      reloadData,
      remove,
      cancelConfirmDialog,
      searchCategory,
      openFilterDialog,
      cancelFilterDialog,
      resumeDialog,
    };
  },
});
</script>

<style scoped></style>
