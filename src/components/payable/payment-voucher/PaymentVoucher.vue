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
        <template v-slot:[`item.reference_no`]="{ item }">
          <span>
            <v-list-item
              class="text-link"
              exact
              light
              @click="previewPaymentVoucher(item.id)"
            >
            {{ item.reference_no }}
            </v-list-item>
          </span>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <span>{{ item.date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.amount | toCurrency() }}
        </template>
        <template v-slot:[`item.amount_paid`]="{ item }">
          {{ item.amount_paid | toCurrency() }}
        </template>
        <template v-slot:[`item.full_paid`]="{ item }">
          {{ fullPaid(item) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                @click="openConfirmDialog(item.id)"
                :disabled="cant('delete', 'Voucher')"
              >
                mdi-trash-can-outline
              </v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
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
                <v-card elevation="2" class="mb-5 p-3">
                  <v-simple-table color="blue lighten-4">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <td>
                            <v-row>
                              <v-col md="4" sm="12" cols="12">
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
                              <v-col md="4" sm="12" cols="12">
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
                              <v-col md="4" sm="12" cols="12">
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
                                (account.allocation - account.totalExpenditure) | toCurrency()
                              }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
                <v-col cols="12" md="12" class="pb-3 pt-7 data-table" v-if="data.payables.length">
                  <v-data-table
                    :headers="payableHeader"
                    disable-pagination
                    hide-default-footer
                  >
                    <template v-slot:body>
                      <tbody>
                        <tr v-for="(item, i) in data.payables" :key="i">
                          <td class="pt-5 pb-2">
                            <span class="text-lg-body-1">{{ item.code }}</span>
                            <br />
                            <span style="color: teal">{{ item.description }}</span>
                            <br />
                            <span class="text--primary">{{ item.balance | toCurrency() }}</span>
                          </td>
                          <td class="pt-5 pb-2">
                            <v-text-field
                              dense
                              outlined
                              :hint="'Available amount: ' + item.balance"
                              persistent-hint
                              type="number"
                              :rules="[maxRules(item.balance)]"
                              v-model="item.amount"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-btn
                              text
                              @click="removePayable(i)"
                            >
                              <v-icon color="red darken-1">mdi-minus-circle</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </v-col>
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

    <Modal :fullScreen="true" :modal="data.paymentVoucherModal" :width="1260">
      <template v-slot:header>
        <ModalHeader :title="`Voucher`" />
      </template>
      <template v-slot:body>
        <ModalBody>
          <div class="" v-if="data.pvDetails">
            <v-col class="d-flex justify-center">
              <div class="font-weight-bold text-center">
                <img :src="data.coat" class="login-logo pt-5" /><br />  
                The United Republic of Tanzania <br />
                President's Office Regional Administration and Local Government <br />
                {{data.pvDetails.council?data.pvDetails.council.name:""}} <br />
                {{data.pvDetails.facility?data.pvDetails.facility.name:"" }} {{data.pvDetails.facility?data.pvDetails.facility.facility_type.name:"" }}<br />
              </div>
            </v-col>
            <v-col class="d-flex justify-center">
              <div class="text-subtitle-1 font-weight-bold">
                VOUCHER
              </div>
            </v-col>
            <v-col>
              <table width="100%">
                <tbody>
                  <tr>
                    <td class="text-left">
                      <span class="font-weight-bold">Payee's name: </span>
                      {{ data.pvDetails.supplier?data.pvDetails.supplier.name:"" }}<br />
                      <span class="font-weight-bold">Mobile #: </span>
                      {{ data.pvDetails.supplier?data.pvDetails.supplier.phone:"" }}<br />
                      <span class="font-weight-bold">Address: </span>
                      {{ data.pvDetails.supplier?data.pvDetails.supplier.address:"" }}<br />
                      <span class="font-weight-bold">TIN: </span>
                      {{ data.pvDetails.supplier?data.pvDetails.supplier.tin:"" }}<br />
                    </td>
                    <td class="text-right">
                      <span>REF NO: </span>
                      <span class="font-weight-bold">
                        {{ data.pvDetails.reference_no }}
                      </span><br />
                      <span>Date: </span>
                      <span class="font-weight-bold">
                        {{ data.pvDetails.date | format("DD/MM/YYYY") }}
                      </span><br /><br /><br />
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="pt-3">
                      <span class="font-weight-bold">
                        Description:
                      </span>
                      {{ data.pvDetails.description }}<br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-col>
            <v-col class="">
              <v-data-table
                    :headers="payablePrintHeader"
                    disable-pagination
                    hide-default-footer
                  >
                <template v-slot:body>
                  <tbody>
                    <tr v-for="(payable, i) in data.pvDetails.payables" :key="i">
                      <td>{{payable.gl_account}}</td>
                      <td>{{payable.funding_source.description}}</td>
                      <td>{{payable.description}}</td>
                      <td class="text-right">{{payable.amount | toCurrency()}}</td>
                    </tr>
                    <tr class="grey lighten-2">
                      <th colspan="3" class="text-right">NET AMOUNT</th>
                      <th class="text-right">{{data.pvDetails.amount | toCurrency()}}</th>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-col>
            <v-col class="pt-10">
              <table width="100%">
                <tbody>
                  <tr>
                    <th class="text-left">Facility Financial Accounting and Reporting System</th>
                    <th class="text-right">Printed on: {{data.pvDetails.printDate | format("DD/MM/YYYY H:mm:ss")}}</th>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </div>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn class="pb-5" color="red darken-1" text @click="cancelPreviewDialog">
            Cancel
          </v-btn>
          <v-btn class="pb-5"
            color="green darken-1"
            text
            @click="printPaymentVoucher(data.pvDetails.id)"
          >
            Print
          </v-btn>
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
      payableHeader,
      payablePrintHeader,
      previewPaymentVoucher,
      printPaymentVoucher,
      cancelPreviewDialog,
      fullPaid,
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
      payableHeader,
      payablePrintHeader,
      previewPaymentVoucher,
      printPaymentVoucher,
      cancelPreviewDialog,
      fullPaid,
    };
  },
});
</script>

<style lang="scss">
.data-table {
  table {
    border: 1px solid #cccc;
    thead {
      th {
        border-right: 1px solid #ccc;
        &:last-child {
          border-right: none;
        }
        &:nth-last-child(2) {
          border-right: none;
        }
      }
    }
    
    tr {
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    
    td {
      border-right: 1px solid #ccc;
      &:last-child {
        border-right: none;
      }
    }
  }
}
.login-logo {
  height: 170px;
  width: 130px;
}
.text-link{
  color: #1976d2 !important;
}
</style>
