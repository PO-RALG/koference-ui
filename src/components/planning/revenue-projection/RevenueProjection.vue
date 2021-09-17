<template>
  <div class="Revenue Projection">
    <Snackbar />

    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
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
            <v-row justify="space-between">
              <v-col cols="4" sm="12" md="2" class="pl-4">
                <v-autocomplete
                  label="Select Financial year"
                  @change="selectFinancialYear($event)"
                  :items="data.financialYearData"
                  :item-text="'name'"
                  :item-divider="true"
                  return-object
                  required
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="6" sm="12" md="4" class="pr-4">
                <v-autocomplete
                  label="Filter by Funding Source Code"
                  @change="searchItem($event)"
                  :items="data.itemsToFilter"
                  :item-text="'funding_source_code'"
                  :item-divider="true"
                  return-object
                  required
                  clearable
                ></v-autocomplete>
              </v-col>
            </v-row>
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

    <Modal :modal="data.modal" :width="960">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Revenue Projection`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="data.formData.code"
                    label="Code"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-select
                    v-model="data.formData.project_id"
                    :items="data.projects"
                    item-value="id"
                    label="Project"
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
                            @input="searchProjects"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="5">
                  <v-select
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
        <ModalHeader :title="`Delete Revenue Projection `" />
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
import { RevenueProjection } from "./types/RevenueProjection";
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import {
  get,
  create,
  update,
  destroy,
  search,
} from "./services/revenue-projection.service";
import { AxiosResponse } from "axios";
import { get as getFinancialYear } from "@/components/setup/financial-year/services/financialyear.service";
import { FinancialYear } from "@/components/setup/financial-year/types/FinancialYear";

export default defineComponent({
  name: "RevenueProjection",
  setup() {
    let dataItems: Array<RevenueProjection> = [];
    let revenueProjectionData = {} as RevenueProjection;
    let financialYearData: [];

    let data = reactive({
      title: "Revenue Projections",
      valid: true,
      isOpen: false,
      node: null,
      response: {},
      modalTitle: "",
      headers: [
        {
          text: "GFS code",
          align: "start",
          sortable: false,
          value: "account.code",
        },
        {
          text: "Funding Source",
          align: "start",
          sortable: false,
          value: "funding_source_code",
        },
        {
          text: "Amount",
          align: "start",
          sortable: false,
          value: "amount",
        },
      ],
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: revenueProjectionData,
      params: {
        total: 100,
        size: 10,
      },
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      financialYearData: financialYearData,
    });

    onMounted(() => {
      getTableData();
    });

    const getTableData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } =
          response.data.data;
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });

      getFinancialYear({ per_page: 10, asc: "id" }).then(
        (response: AxiosResponse) => {
          data.financialYearData = response.data.data.data;
        }
      );
    };

    const searchItem = (itemName: RevenueProjection) => {
      if (itemName != null) {
        search({ funding_source_code: itemName.funding_source_code }).then(
          (response: AxiosResponse) => {
            data.items = response.data.data.data;
          }
        );
      }
    };

    const selectFinancialYear = (year: FinancialYear) => {
      if (year != null) {
        search({ financial_year_id: year.id }).then(
          (response: AxiosResponse) => {
            let { from, to, total, current_page, per_page, last_page } =
              response.data.data;
            data.items = response.data.data.data;
            data.response = {
              from,
              to,
              total,
              current_page,
              per_page,
              last_page,
            };
          }
        );
      }
    };

    const getData = (params: RevenueProjection) => {
      data.response = params;
      get(params).then((response: AxiosResponse) => {
        data.response = response.data.data;
        data.items = response.data.data.data;
      });
    };

    const openConfirmDialog = (deleteId: string) => {
      data.deletemodal = !data.modal;
      data.itemtodelete = deleteId;
    };

    const cancelDialog = () => {
      data.formData = {} as RevenueProjection;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as RevenueProjection;
      data.deletemodal = false;
    };

    const remove = () => {
      destroy(data.itemtodelete).then(() => {
        data.deletemodal = false;
        getTableData();
      });
    };

    const save = () => {
      if (data.formData.id) {
        updateRevenueProjection(data.formData);
      } else {
        createRevenueProjection(data.formData);
      }
    };

    const openDialog = (formData?: RevenueProjection) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as RevenueProjection;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateRevenueProjection = (data: RevenueProjection) => {
      update(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    const createRevenueProjection = (data: RevenueProjection) => {
      create(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateRevenueProjection,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      selectFinancialYear,
    };
  },
});
</script>

<style scoped></style>
