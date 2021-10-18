<template>
  <div class="Payment Voucher">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'Voucher')"
      >
        <v-icon>mdi-plus</v-icon>
        Add New
      </v-btn>
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
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-autocomplete
                label="Filter by Reference number"
                @change="searchItem($event)"
                :items="data.itemsToFilter"
                :item-text="'reference_no'"
                :item-divider="true"
                return-object
                required
                clearable
              ></v-autocomplete>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            @click="openConfirmDialog(item.id)"
            :disabled="cant('delete', 'Voucher')"
          >
            mdi-trash-can-outline
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

    <Modal :modal="data.modal" :width="1260">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Payment Voucher`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row class="pa-2 pb-5">
                <v-col cols="12" md="2">
                  <DatePicker
                    :label="'Date'"
                    v-model="data.formData.date"
                    required
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-select
                    v-model="data.formData.supplier_id"
                    :items="data.suppliers"
                    item-value="id"
                    item-text="name"
                    label="Select Payee"
                    required
                  >
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            v-model="data.searchTerm"
                            placeholder="Search"
                            @input="searchSuppliers"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
                  ></v-text-field>
                </v-col>
              </v-row>
              <template>
                <v-card elevation="2" class="pb-5">
                  <v-simple-table color="blue lighten-4">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <td colspan="2">
                            <v-row>
                              <v-col md="4" sm="12">
                                <v-select
                                  :items="data.activities"
                                  item-text="name"
                                  label="Select Activity"
                                  @change="searchFundingSource($event)"
                                  required
                                >
                                  <template v-slot:selection="{ item }">
                                    {{ item.description }} ({{
                                      item.sub_budget_class.description
                                    }})
                                  </template>
                                  <template v-slot:item="{ item }">
                                    {{ item.description }} ({{
                                      item.sub_budget_class.description
                                    }})
                                  </template>
                                  <template v-slot:prepend-item>
                                    <v-list-item>
                                      <v-list-item-content>
                                        <v-text-field
                                          v-model="data.searchTerm"
                                          placeholder="Search"
                                          @input="searchActivities"
                                        ></v-text-field>
                                      </v-list-item-content>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                  </template>
                                </v-select>
                              </v-col>
                              <v-col md="4" sm="12">
                                <v-select
                                  :items="data.fundingSources"
                                  item-text="code"
                                  label="Select Funding Sources"
                                  @change="searchGfsCodes($event)"
                                  return-object
                                >
                                  <template v-slot:selection="{ item }">
                                    {{ item.code }} - {{ item.description }}
                                  </template>
                                  <template v-slot:item="{ item }">
                                    {{ item.code }} - {{ item.description }}
                                  </template>
                                </v-select>
                              </v-col>
                              <v-col md="4" sm="12">
                                <v-select
                                  :items="data.gfsCodes"
                                  item-value="code"
                                  item-text="name"
                                  label="Select GFS Code"
                                  @change="filterGfsCodes($event)"
                                >
                                  <template v-slot:selection="{ item }">
                                    {{ item.code }} - {{ item.name }}
                                  </template>
                                  <template v-slot:item="{ item }">
                                    {{ item.code }} - {{ item.name }}
                                  </template>
                                </v-select>
                              </v-col>
                            </v-row>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(account, i) in data.accounts" :key="i">
                          <td
                            class="py-2"
                            @click="addPayable(account)"
                            colspan="2"
                          >
                            <span>{{ account.code }}</span>
                            <br />
                            <span style="color: teal">
                              {{ account.description }}
                            </span>
                            <br />
                            <span>
                              {{
                                account.allocation - account.totalExpenditure
                              }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </template>
              <template>
                <div
                  class="pa-3 pt-7"
                  v-for="(item, i) in data.payables"
                  :key="i"
                >
                  <v-row>
                    <v-col md="8" sm="12">
                      <span class="text-lg-body-1">{{ item.code }}</span>
                      <br />
                      <span style="color: teal">{{ item.description }}</span>
                      <br />
                      <span class="text--primary">{{ item.balance }}</span>
                    </v-col>
                    <v-col md="3" sm="12">
                      <v-text-field
                        :hint="'Available amount: ' + item.balance"
                        persistent-hint
                        type="number"
                        :rules="[maxRules(item.balance)]"
                        v-model="item.amount"
                        label="Amount"
                      ></v-text-field>
                    </v-col>
                    <v-col md="1" sm="12">
                      <v-btn
                        text
                        @click="removePayable(i)"
                      >
                        <v-icon color="red darken-1">mdi-minus-circle</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </template>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="save"
            :disabled="!data.valid"
          >
            {{ data.modalTitle }}
          </v-btn>
        </ModalFooter>
      </template>
    </Modal>

    <Modal :modal="data.deletemodal" :width="300">
      <template v-slot:header>
        <ModalHeader :title="`Delete Payment Voucher `" />
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
import { defineComponent } from "@vue/composition-api";
import { usePaymentVoucher } from "./composables/payment-voucher";

export default defineComponent({
  name: "PaymentVoucher",
  setup() {
    const {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      searchSuppliers,
      addPayable,
      removePayable,
      searchActivities,
      searchGfsCodes,
      searchFundingSource,
      filterGfsCodes,
      maxRules,
      resetBudget,
    } = usePaymentVoucher();

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      save,
      remove,
      cancelConfirmDialog,
      searchItem,
      getData,
      searchSuppliers,
      addPayable,
      removePayable,
      searchActivities,
      searchGfsCodes,
      searchFundingSource,
      filterGfsCodes,
      maxRules,
      resetBudget,
    };
  },
});
</script>

<style scoped></style>
