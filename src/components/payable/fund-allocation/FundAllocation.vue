<template>
  <div class="Fund Allocation">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-card-title>
        <v-col cols="6" sm="12" md="2" class="pa-0">
          <v-select
            v-model="data.funding_source_id"
            :items="data.fundingSources"
            item-value="id"
            label="Funding source"
            @change="searchBudgets(data.funding_source_id)"
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
                    @input="searchFundingSources"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-select>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.itemUnallocated.carryover" label="Carryover Fund" disabled></v-text-field>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.itemUnallocated.current" label="Current Fund" disabled></v-text-field>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.itemUnallocated.total" label="Total Fund" disabled></v-text-field>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.itemUnallocated.allocated" label="Total Allocated" disabled></v-text-field>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.running_balance" label="Unallocated Amount" disabled></v-text-field>
        </v-col>
      </v-card-title>
      <v-card-text>
        <template>
          <v-row>
            <v-col cols="12" md="4" sm="12"><h3>GL Account</h3></v-col>
            <v-col cols="12" md="1" sm="12"><h3>Budget</h3></v-col>
            <v-col cols="12" md="1" sm="12"><h3>Allocated</h3></v-col>
            <v-col cols="12" md="1" sm="12"><h3>Expenditure</h3></v-col>
            <v-col cols="12" md="2" sm="12"><h3>Available</h3></v-col>
            <v-col cols="12" md="2" sm="12"><h3>Allocate</h3></v-col>
          </v-row>
        </template>
        <template v-for="(item, i) in data.items.lines">
          <v-row
            :key="i"
            cols="12"
          >
            <v-col cols="12" md="4" sm="12">
              {{item.gl}} <br>
              <span style="color:teal">{{item.activity}}({{item.budget_category}})</span> <br>
              {{item.gfs}} <br>
            </v-col>
            <v-col cols="12" md="1" sm="12">
              {{item.amount}}
            </v-col>
            <v-col cols="12" md="1" sm="12">
              {{item.total_allocated}}
            </v-col>
            <v-col cols="12" md="1" sm="12">
              {{item.expenditure}}
            </v-col>
            <v-col cols="12" md="2" sm="12">
              {{item.total_allocated - item.expenditure}}
            </v-col>
            <v-col cols="12" md="2" sm="12">
              <v-text-field v-model="item.allocation_amount" @input="newAllocation(item.allocation_amount)" type="number"></v-text-field>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
    </v-card>

    <Modal :modal="data.modal" :width="960">
      <template v-slot:header>
        <ModalHeader :title="`${data.modalTitle} Supplier`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="data.formData">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field v-model="data.formData.name" label="Name" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field v-model="data.formData.email" label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field v-model="data.formData.tin" label="TIN"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field v-model="data.formData.phone" label="Phone"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field v-model="data.formData.address" label="Address"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field v-model="data.formData.bank_account_name" label="Bank Account Name"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-text-field v-model="data.formData.bank_account_number" label="Bank Account Number"></v-text-field>
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
        <ModalHeader :title="`Delete Supplier `" />
      </template>
      <template v-slot:body>
        <ModalBody> Are you sure? </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelConfirmDialog"> Cancel </v-btn>
          <v-btn color="green darken-1" text @click="remove">Yes</v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { get, create, update, destroy, search } from "./services/fund-allocation.service";
import { FundAllocation } from "@/components/payable/fund-allocation/types/FundAllocation"
import { get as getFundingSource } from "@/components/coa/funding-source/services/funding-sources"

export default defineComponent({
  name: "FundAllocation",
  setup() {
    let dataItems = {lines:[]};
    let fundAllocationData = {} as FundAllocation;

    let data = reactive({
      title: "Fund Allocations",
      valid: true,
      isOpen: false,
      node: null,
      response: {},
      modalTitle: "",
      modal: false,
      deletemodal: false,
      items: dataItems,
      itemsToFilter: [],
      formData: fundAllocationData,
      params: {
        total: 100,
        size: 10,
      },
      rows: ["10", "20", "50", "100"],
      itemtodelete: "",
      searchTerm: "",
      funding_source_id:"",
      fundingSources:[],
      itemUnallocated:{allocated: 0,total: 0,current: 0,carryover: 0 },
      running_balance:0,
    });

    onMounted(() => {
      getTableData();
      getFundingSource({ per_page: 10 }).then((response: AxiosResponse) => {
        data.fundingSources = response.data.data.data;
      });
    });

    const getTableData = () => {
      get({ per_page: 10 }).then((response: AxiosResponse) => {
        let { from, to, total, current_page, per_page, last_page } = response.data.data;
        data.items = response.data.data.data;
        data.itemsToFilter = response.data.data.data;
        data.response = { from, to, total, current_page, per_page, last_page };
      });
    };

    const getData = (params: FundAllocation) => {
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
      data.formData = {} as FundAllocation;
      data.modal = !data.modal;
    };

    const cancelConfirmDialog = () => {
      data.formData = {} as FundAllocation;
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
        updateActivity(data.formData);
      } else {
        createActivity(data.formData);
      }
    };

    const openDialog = (formData?: FundAllocation) => {
      if (formData.id) {
        data.formData = formData;
        data.modalTitle = "Update";
      } else {
        data.formData = {} as FundAllocation;
        data.modalTitle = "Create";
      }
      data.modal = !data.modal;
    };

    const updateActivity = (data: FundAllocation) => {
      update(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    const createActivity = (data: FundAllocation) => {
      create(data).then(() => {
        cancelDialog();
        getTableData();
      });
    };

    const searchFundingSources = (item: string) => {
      let regSearchTerm = item ? item : data.searchTerm;
      getFundingSource({ per_page: 10, regSearch: regSearchTerm }).then((response: AxiosResponse) => {
        data.fundingSources = response.data.data.data;
      });
    };

    const searchBudgets = (id) => {
      if (id != null) {
        let fundbudgetData = {
          "data":{
              "funding_source_id":"24",
              "lines":[
                {
                    "amount":"1731600",
                    "activity_id":1521783,
                    "gfs_code_id":182,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22013111",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":"151740",
                    "muse_gl":null,
                    "id":1148300,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Examination Expenses",
                    "total_allocated":"216400",
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"268158.24",
                    "activity_id":1521783,
                    "gfs_code_id":113,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22004110",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":0,
                    "muse_gl":null,
                    "id":1148301,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Consumable Medical Supplies",
                    "total_allocated":0,
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"799200",
                    "activity_id":1521783,
                    "gfs_code_id":80,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22001101",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":0,
                    "muse_gl":null,
                    "id":1148302,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Office Consumables (papers,pencils, pens and stationaries)",
                    "total_allocated":0,
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"777000",
                    "activity_id":1521783,
                    "gfs_code_id":89,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22001112",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":"200000",
                    "muse_gl":null,
                    "id":1148303,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Outsourcing Costs (includes cleaning and security services)",
                    "total_allocated":"200000",
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"393000",
                    "activity_id":1521783,
                    "gfs_code_id":324,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22001114",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":0,
                    "muse_gl":null,
                    "id":1148304,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Other Administration Expense",
                    "total_allocated":0,
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"450000",
                    "activity_id":1521783,
                    "gfs_code_id":40,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-21113103",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":"95600",
                    "muse_gl":null,
                    "id":1148305,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Extra-Duty",
                    "total_allocated":"96400",
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"659015.76",
                    "activity_id":1521783,
                    "gfs_code_id":262,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22024106",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":0,
                    "muse_gl":null,
                    "id":1148306,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Outsource maintenance contract services",
                    "total_allocated":0,
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"650000",
                    "activity_id":1521783,
                    "gfs_code_id":922,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-31113114",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":0,
                    "muse_gl":null,
                    "id":1148307,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Outdoor sports and recreational facilities",
                    "total_allocated":0,
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"70000",
                    "activity_id":1521783,
                    "gfs_code_id":91,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS4-CS4475-2-00000-20J-22002101",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-08-07 11:25:45",
                    "updated_at":"2021-08-07 11:25:45",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":"20000",
                    "muse_gl":null,
                    "id":1148308,
                    "budget_category":"BA",
                    "activity":"To facilitate schools fees compensation to all 15 secondary schools by June 2024",
                    "gfs":"Electricity",
                    "total_allocated":"20000",
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"287100",
                    "activity_id":1743748,
                    "gfs_code_id":148,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS7-CS7443-7-00000-20J-22010105",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-09-07 10:17:14",
                    "updated_at":"2021-09-07 10:17:14",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":0,
                    "muse_gl":null,
                    "id":1339412,
                    "budget_category":"CF",
                    "activity":"To facilitate Distribution of schools fees compensation  to secondary schools by September 2021",
                    "gfs":"Per Diem - Domestic",
                    "total_allocated":0,
                    "allocation_amount":0,
                    "isValid":true
                },
                {
                    "amount":"350000",
                    "activity_id":1743748,
                    "gfs_code_id":80,
                    "funding_source_id":24,
                    "gl":"086-2005-03106-509B-0000000-S0003809-201-4393-CS7-CS7443-7-00000-20J-22001101",
                    "facility_id":18998,
                    "financial_year_id":6,
                    "fund_type_id":1,
                    "created_at":"2021-09-07 10:17:14",
                    "updated_at":"2021-09-07 10:17:14",
                    "deleted_at":null,
                    "allocation":null,
                    "expenditure":0,
                    "muse_gl":null,
                    "id":1339413,
                    "budget_category":"CF",
                    "activity":"To facilitate Distribution of schools fees compensation  to secondary schools by September 2021",
                    "gfs":"Office Consumables (papers,pencils, pens and stationaries)",
                    "total_allocated":0,
                    "allocation_amount":0,
                    "isValid":true
                }
              ],
              "total_budget":6435074
          },
          "message":"success",
          "errors":"",
          "status":200
        }
        
        let unallocatedData = {
          "data":{
              "unallocated":637100,
              "total":1169900,
              "allocated":532800,
              "current":532800,
              "carryover":637100,
              "fund_status":false
          },
          "message":"ok",
          "errors":"",
          "status":200
        }

        data.items = fundbudgetData.data;
        data.itemUnallocated = unallocatedData.data;
        data.running_balance = data.itemUnallocated.total-data.itemUnallocated.allocated;
        
        // search({ name: id.name }).then((response: AxiosResponse) => {
        //   data.items = response.data.data.data;
        // });
      }
    };

    const newAllocation = (amount:number)=>{
      if (amount != null) {
        let allocatedArray = data.items.lines;
        let sum_allocated = allocatedArray.reduce((sum: number, b: any ) => { return sum + parseFloat(b.allocation_amount)},0);
        console.log(sum_allocated);
        data.itemUnallocated.allocated = data.itemUnallocated.allocated + sum_allocated;
        data.running_balance = data.itemUnallocated.total-data.itemUnallocated.allocated;
      }
      
    }

    return {
      data,
      openDialog,
      cancelDialog,
      openConfirmDialog,
      updateActivity,
      save,
      remove,
      cancelConfirmDialog,
      getData,
      searchFundingSources,
      searchBudgets,
      newAllocation,
    };
  },
});
</script>

<style scoped></style>
