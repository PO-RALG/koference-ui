<template>
  <div class="bank-accounts">
    <Snackbar />

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
        :single-expand="true"
        class="elevation-1"
      >
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
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2"
                @click="openDialog(item)"
              >
                mdi-pencil-box-outline
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="addSubAccount(item.id)"
                >mdi-plus</v-icon
              >
            </template>
            <span>Add GL</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="deleteSubBudgetClass(item.id)"
                >mdi-trash-can-outline</v-icon
              >
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
                  <v-text-field
                    v-model="data.formData.branch"
                    label="Branch"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="data.formData.name"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="data.formData.bank"
                    label="Bank"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="data.formData.number"
                    label="Number"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-autocomplete
                    v-model="data.formData.gfs_code_id"
                    label="Gfs Codes"
                    :items="newGfsCodes"
                    readonly
                    :item-text="'name'"
                    item-value="id"
                    :item-divider="true"
                    required
                    clearable
                    @click="openFilterDialog"
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
          <v-btn color="green darken-1" text @click="save"
            >{{ data.modalTitle }}
          </v-btn>
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
          <v-btn color="green darken-1" text @click="cancelConfirmDialog"
            >Cancel</v-btn
          >
          <v-btn color="red darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.filterdialog" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`Select Gfscode to be mapped`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-radio-group
            v-if="data.formData"
            v-model="data.formData.gfs_code_id"
          >
            <v-radio
              v-for="n in newGfsCodes"
              :key="n.code"
              :label="n.name"
              :value="n.id"
              :disabled="n.bank_account.length != 0"
            ></v-radio>
          </v-radio-group>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelFilterDialog"
            >Cancel</v-btn
          >
          <v-btn color="green darken-1" text @click="resumeDialog"
            >Select</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="data.addGl" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`Select SBC`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-row class="pt-12">
            <v-col cols="12" lg="12" md="12" sm="12" class="mt-n8">
              <DualMultiSelect
                :label="'Filter SBC'"
                :items="data.subbudgetclasses"
                :title="'Select SBC'"
                :selectedItems="data.selectedSbc"
                @filterFunction="filterSbc"
                v-model="data.selectedSbc"
              />
            </v-col>
          </v-row>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="canceladdGl">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="saveGl">Add</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { BackAccount } from "./types/BackAccount";
import store from "@/store";
import {
  defineComponent,
  reactive,
  watch,
  onMounted,
  computed,
} from "@vue/composition-api";

import {
  get,
  create,
  update,
  destroy,
  search,
} from "./services/back-accounts.service";
import { gfscodes } from "../../setup/gfs-codes/service/gfs.service";
import { subbudgetclasses } from "../../setup/sub-budget-classes/services/sub-budget-classes.service";

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
      gfscodes: [],
      filterdialog: false,
      addGl: false,
      selectedSbc: [],
      subbudgetclasses: [],
    });

    onMounted(() => {
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
      gfscodes().then((response: any) => {
        console.log("gfs codes", response.data.data.data);
        data.gfscodes = response.data.data;
      });
    });
    const newGfsCodes = computed(() => {
      return data.gfscodes.map((data) => ({
        ...data,
        name: data.bank_account.length
          ? data.name +
            " " +
            "[" +
            " This Gfscode already maped to" +
            " " +
            data.bank_account[0].bank +
            " Account Number" +
            " " +
            data.bank_account[0].number +
            " ]"
          : data.name,
      }));
    });

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
      gfscodes().then((response: any) => {
        console.log("gfs codes", response.data.data.data);
        data.gfscodes = response.data.data;
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

    const addSubAccount = () => {
      subbudgetclasses({ per_page: 2000 }).then((response) => {
        data.addGl = true;
        data.subbudgetclasses = response.data.data.data;
      });
    };

    const canceladdGl = () => {
      data.addGl = false;
    };
    const filterSbc = (term: string) => {
      let result = data.subbudgetclasses.filter((item) =>
        item.code.toLowerCase().includes(term.toLowerCase())
      );
      data.subbudgetclasses = result;
      return data.subbudgetclasses;
    };

    const saveGl = () => {};

    watch(
      () => store.state.snackbar,
      () => {
        console.log("datazzzzz", store.getters.getSnackBar);
      }
    );

    return {
      filterSbc,
      data,
      addSubAccount,
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
      newGfsCodes,
      openFilterDialog,
      cancelFilterDialog,
      resumeDialog,
      canceladdGl,
      saveGl,
    };
  },
});
</script>

<style scoped></style>
