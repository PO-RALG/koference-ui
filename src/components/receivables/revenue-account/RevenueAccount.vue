<template>
  <div class="customers">
    <v-card-actions :class="headerPadding">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openDialog(data.formData)">
        <v-icon>mdi-plus</v-icon>
        Generate Revenue GL Accounts
      </v-btn>
    </v-card-actions>
    <v-card :class="cardPadding">
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        :single-expand="true"
        :class="elevation"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:[`item.code`]="{ item }">
          <span>{{ item.code }}</span>
        </template>
        <template v-slot:[`item.description`]="{ item }">
          <span>{{ item.description }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon v-text="Update" class="mr-2" @click="generate(item)">
            mdi-refresh
          </v-icon>
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
    <Modal :modal="data.modal" :width="800">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle}`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row align="center">
                <v-col cols="12" md="12" class="d-flex">
                  <v-select
                    :items="data.fundingSources"
                    :item-text="'description'"
                    v-model="data.formData.fund_source_code"
                    label="Select Fund Source"
                    item-value="code"
                    outlined
                    item-disabled="disabled"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.description }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.description }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            clearable
                            outlined
                            dense
                            label="Search Fund Source"
                            v-model="data.searchTerm"
                            @input="filterFundSource"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row align="center">
                <v-col cols="12" md="12" class="d-flex">
                  <v-select
                    :items="data.gfsCodes"
                    :item-text="'description'"
                    v-model="data.formData.gfs_code"
                    label="Select GFS"
                    item-value="code"
                    outlined
                    item-disabled="disabled"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.name }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            clearable
                            outlined
                            dense
                            label="Search GFS"
                            v-model="data.gfs_searchTerm"
                            @input="filterGfs"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row align="center">
                <v-col cols="12" md="12" class="d-flex">
                  <v-select
                    :items="data.subBudgetClasses"
                    :item-text="'description'"
                    v-model="data.formData.sub_budget_class_code"
                    label="Select SBC"
                    item-value="code"
                    outlined
                    item-disabled="disabled"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.description }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.description }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            clearable
                            outlined
                            dense
                            label="Search SBC"
                            v-model="data.sbc_searchTerm"
                            @input="filterSubBudgetClasses"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row align="center">
                <v-col cols="12" md="12" class="d-flex">
                  <v-select
                    :items="data.facilityTypes"
                    :item-text="'description'"
                    v-model="data.formData.facility_type_code"
                    label="Select Facility Type"
                    item-value="code"
                    outlined
                    item-disabled="disabled"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.name }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            clearable
                            outlined
                            dense
                            label="Search Facility Type"
                            v-model="data.facility_type_searchTerm"
                            @input="filterFacilityTypes"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row align="center">
                <v-col cols="12" md="12" class="d-flex">
                  <v-text-field
                    v-model="data.formData.cost_center_code"
                    label="Cost center"
                    outlined
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
          <v-btn color="blue darken-1" text @click="save"
            >{{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRevenueAccounts } from "./composables/revenue-account";

export default defineComponent({
  props: {
    headerPadding: {
      type: String,
      required: false,
      default: "pa-0",
    },
    cardPadding: {
      type: String,
      required: false,
      default: "pa-0",
    },
    elevation: {
      type: String,
      required: false,
      default: "elevation-2",
    },
  },
  name: "RevenueAccount",
  setup() {
    const {
      data,
      getData,
      openDialog,
      cancelDialog,
      reloadData,
      save,
      filterFundSource,
      filterGfs,
      filterSubBudgetClasses,
      filterFacilityTypes,
    } = useRevenueAccounts();

    return {
      data,
      getData,
      openDialog,
      cancelDialog,
      save,
      filterFundSource,
      filterGfs,
      filterSubBudgetClasses,
      filterFacilityTypes,
    };
  },
});
</script>

<style scoped></style>
