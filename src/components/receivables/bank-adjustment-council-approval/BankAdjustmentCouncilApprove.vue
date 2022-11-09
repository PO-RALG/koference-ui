<template>
  <div class="customers">
    <v-card-actions class="pl-4">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        :single-expand="true"
        class="elevation-1 pa-2"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:[`item.approve`]="{ item }">
          <span v-if="item && item.approve && !item.approve.council_approved">{{
            "Waiting for Approval"
          }}</span>
          <span v-else>{{ "Approved" }}</span>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.ab_number`]="{ item }">
          <span>{{ item.ab_number }}</span>
        </template>
        <template v-slot:[`item.bank_account_name`]="{ item }">
          <span>{{ item.bank_account_number }}</span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          <span>{{ item.amount }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="
              canApproveCouncil(
                item,
                'BANK_ADJUSTMENT',
                'approvalPendingCouncil',
                'BankAdjustment'
              )
            "
            @click="approveBACouncil(item)"
            color="primary"
            text
          >
            <v-icon>mdi-check-decagram</v-icon>
            APPROVE
          </v-btn>
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
    <Modal :modal="data.genericConfirmModel" :width="800">
      <template v-slot:header>
        <ModalHeader :title="data.modalTitle" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-list three-line>
            <template>
              <v-subheader>ADJUSTMENT DETAILS</v-subheader>

              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-avatar>
                  <v-img>
                    <v-icon>mdi-information-variant</v-icon>
                  </v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ "GL ACCOUNT" }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-html="data.formData2.gl_account"
                  ></v-list-item-subtitle>
                  <v-divider class="pt-5"></v-divider>

                  <v-list-item-title> {{ "BANK NAME" }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ data.formData2.bank_account.bank }} {{ " - " }}
                    {{
                      data.formData2.bank_account.branch
                    }}</v-list-item-subtitle
                  >
                  <v-divider></v-divider>
                  <v-simple-table class="pt-5">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Fund Source</th>
                          <th class="text-left">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in data.formData2.items" :key="item.id">
                          <td>{{ item.funding_source.description }}</td>
                          <td>{{ item.amount }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelGenericConfirmDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="data.genericDialogAction"
            >APPROVE</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="data.previewBAModal" :width="600">
      <template v-slot:header>
        <ModalHeader :title="data.modalTitle" />
      </template>
      <template v-slot:body>
        <ModalBody> {{ "Accept to" }} {{ data.modalTitle }}</ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelGenericConfirmDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="data.genericDialogAction"
            >Yes</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="data.modal" :width="1200">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle}`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    v-model="data.formData.bank_account_id"
                    :items="data.bankaccounts"
                    item-value="id"
                    name="name"
                    item-text="name"
                    label="Select account"
                    outlined
                    required
                  >
                  </v-select>
                </v-col>

                <v-col cols="12" md="6" sm="12">
                  <DatePicker
                    :label="'Date'"
                    v-model="data.formData.date"
                    required
                  />
                </v-col>
              </v-row>

              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    v-model="data.formData.debit"
                    :items="data.effects"
                    item-value="id"
                    name="name"
                    item-text="name"
                    label="Cashbook Adjustment"
                    outlined
                    required
                  >
                  </v-select>
                </v-col>
              </v-row>

              <v-row align="center">
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="data.formData.description"
                    label="Description"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-container v-if="data.formData.date < '2022-07-01'">
                <v-card>
                  <v-card-title class="blue-grey darken-1">
                    <span class="text-h5 white--text"
                      >Amount By Fund Source</span
                    >
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-container pa-5 ma-5>
                    <v-row
                      v-for="(item, index) of data.formData.items"
                      :key="item.id"
                      align="center"
                    >
                      <v-col cols="10" md="7" class="d-flex">
                        <v-select
                          :items="data.fundingsources"
                          :item-text="'description'"
                          v-model="data.formData.items[index].funding_source_id"
                          :name="`data.receipt.items[${index}]`"
                          label="Select Fund Source"
                          item-value="id"
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
                      <v-col cols="10" md="3">
                        <v-text-field
                          v-model="data.formData.items[index].amount"
                          label="Amount"
                          outlined
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="1" md="1">
                        <span
                          v-if="
                            index != data.formData.items.length - 1 &&
                            data.formData.items.length > 1
                          "
                        >
                          <v-btn
                            color="grey darken-2"
                            text
                            @click="removeItem(index)"
                          >
                            <v-icon dark left> mdi-minus-circle </v-icon>Remove
                          </v-btn>
                        </span>
                        <span v-if="index == data.formData.items.length - 1">
                          <v-btn color="green darken-2" text @click="addItem">
                            <v-icon dark left> mdi-plus-circle </v-icon>add
                          </v-btn>
                        </span>
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="10" md="7">
                        <strong> Total Amount:</strong>
                      </v-col>
                      <v-col cols="10" md="3" class="pa-1">
                        <strong> {{ totalAmount | toCurrency() }} </strong>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-container>
              <v-container v-if="data.formData.date > '2022-07-01'">
                <v-card>
                  <v-select
                    :items="data.glAccounts"
                    :item-text="'code'"
                    v-model="data.formData.gl_account"
                    :name="`data.formData.gl_account`"
                    label=" Account "
                    item-value="id"
                    outlined
                    item-disabled="disabled"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.description }} {{ "-" }} {{ item.code }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.description }} {{ "-" }} {{ item.code }}({{
                        item.fund_source.description
                      }})
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            clearable
                            outlined
                            dense
                            label="Search GL Account"
                            v-model="data.searchTerm"
                            @input="filterGLAccounts"
                          ></v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-card>
                <v-card cols="10" md="3">
                  <v-text-field
                    v-model="data.formData.amount"
                    label="Amount"
                    outlined
                    required
                  ></v-text-field>
                </v-card>
              </v-container>
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
import { useBankAdjustmentCouncilApprove } from "./composables/bank-adjustment-council-approval";
import { toMoney } from "@/filters/CurrencyFormatter";

export default defineComponent({
  name: "BankAdjustmentCouncilApprove",
  setup() {
    const {
      data,
      getData,
      openDialog,
      cancelDialog,
      reloadData,
      save,
      addItem,
      removeItem,
      totalAmount,
      reverse,
      filterFundSource,
      filterGLAccounts,
      approveBACouncil,
      cancelGenericConfirmDialog,
    } = useBankAdjustmentCouncilApprove();

    return {
      data,
      getData,
      openDialog,
      cancelDialog,
      save,
      addItem,
      removeItem,
      reloadData,
      totalAmount,
      reverse,
      filterFundSource,
      filterGLAccounts,
      toMoney,
      approveBACouncil,
      cancelGenericConfirmDialog,
    };
  },
});
</script>

<style scoped></style>
