<template>
  <div class="ChequeList">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="openDialog"
        :disabled="cant('create', 'ChequeList')"
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
            
          </v-card-title>
        </template>
        <template v-slot:[`item.reference_no`]="{ item }">
          <span>
            <v-list-item
              class="text-link"
              exact
              light
              @click="previewPayment(item.id)"
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
        <ModalHeader :title="`${data.modalTitle} Cheque list`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form v-model="data.valid">
            <v-container>
              <v-row class="pa-2 pb-5">
                <v-col cols="12" md="3">
                  <DatePicker
                    :label="'Date'"
                    v-model="data.formData.date"
                    required
                  />
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-select
                    v-model="data.formData.bank_account_id"
                    :items="data.bankAccounts"
                    item-text="name"
                    item-value="id"
                    label="Select Bank Account"
                    required
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                  <v-btn
                    color="primary"
                    @click="searchPaymentByDate"
                    :disabled="!data.valid"
                  >
                    {{ `Search Payments` }}
                  </v-btn>
                </v-col>
              </v-row>
              <template>
                <v-col cols="12" md="12" v-if="data.formData.date">
                  <v-data-table
                    :headers="data.paymentHeaders"
                    :items="data.payments"
                    disable-pagination
                    hide-default-footer
                  >
                    <template v-slot:[`item.payment_date`]="{ item }">
                      <span>{{ item.payment_date | format("DD/MM/YYYY") }}</span>
                    </template>
                    <template v-slot:[`item.amount`]="{ item }">
                      {{ item.amount | toCurrency() }}
                    </template>
                    <template v-slot:[`item.bank_account`]="{ item }">
                      {{ item.bank_account.number  }}({{ item.bank_account.name }})
                    </template>
                    <template v-slot:[`item.activations`]="{ item }">
                      <v-switch
                        :input-value="item.active"
                        @change="setActivation(item)"
                        value
                      ></v-switch>
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

    <Modal :fullScreen="true" :modal="data.CreditorModal" :width="1260">
      <template v-slot:header>
        <ModalHeader :title="`ChequeList`" />
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
                      <table>
                        <tr>
                          <td>
                            <span class="font-weight-bold">Payee's name: </span><br />
                            <span class="font-weight-bold">Mobile #: </span><br />
                            <span class="font-weight-bold">Address: </span><br />
                            <span class="font-weight-bold">TIN: </span><br />
                          </td>
                          <td>
                            {{ data.pvDetails.supplier?data.pvDetails.supplier.name:"" }}<br />
                            {{ data.pvDetails.supplier?data.pvDetails.supplier.phone:"" }}<br />
                            {{ data.pvDetails.supplier?data.pvDetails.supplier.address:"" }}<br />
                            {{ data.pvDetails.supplier?data.pvDetails.supplier.tin:"" }}<br />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="text-right">
                      <table class="float-right">
                        <tr>
                          <td>
                            <span>REF #: </span><br />
                            <span>Date: </span><br /><br /><br />
                          </td>
                          <td>
                            <span class="font-weight-bold">
                              {{ data.pvDetails.reference_no }}
                            </span><br />
                            <span class="font-weight-bold">
                              {{ data.pvDetails.date | format("DD/MM/YYYY") }}
                            </span><br /><br /><br />
                          </td>
                        </tr>
                      </table>
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
                    <th class="text-right">Printed on: {{data.pvDetails.printDate}}</th>
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
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useChequeList } from "./composables/cheque-list";

export default defineComponent({
  name: "Creditor",
  setup() {
    const {
      data,
      searchItem,
      getData,
      payablePrintHeader,
      previewPayment,
      cancelPreviewDialog,
      openDialog,
      cancelDialog,
      save,
      searchPaymentByDate,
    } = useChequeList();

    return {
      data,
      searchItem,
      getData,
      payablePrintHeader,
      previewPayment,
      cancelPreviewDialog,
      openDialog,
      cancelDialog,
      save,
      searchPaymentByDate,
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
