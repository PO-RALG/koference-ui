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
          <v-text-field v-model="data.items.total_budget" label="Carryover Fund" disabled></v-text-field>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.items.total_budget" label="Current Fund" disabled></v-text-field>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.items.total_budget" label="Total Fund" disabled></v-text-field>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.items.total_budget" label="Total Allocated" disabled></v-text-field>
        </v-col>
        <v-col cols="6" sm="12" md="2">
          <v-text-field v-model="data.items.total_budget" label="Unallocated Amount" disabled></v-text-field>
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
              {{item.allocation}}
            </v-col>
            <v-col cols="12" md="2" sm="12">
              <v-text-field v-model="item.allocation_amount"></v-text-field>
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
    let dataItems = {};
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
        let bgData = {"bgdata":{
            "funding_source_id":"5",
            "lines":[
              {
                  "amount":"100000",
                  "activity_id":1442408,
                  "gfs_code_id":80,
                  "funding_source_id":5,
                  "gl":"087-2005-03075-508D-0000000-10665808-108-0000-ES5-ES5633-1-00000-80E-22001101",
                  "facility_id":20609,
                  "financial_year_id":6,
                  "fund_type_id":1,
                  "created_at":"2021-07-26 09:41:40",
                  "updated_at":"2021-07-26 09:41:40",
                  "deleted_at":null,
                  "allocation":null,
                  "expenditure":0,
                  "muse_gl":null,
                  "id":1092014,
                  "budget_category":"BA",
                  "activity":"To support administrative logistics of health centre by June 2022",
                  "gfs":"Office Consumables (papers,pencils, pens and stationaries)",
                  "total_allocated":0,
                  "allocation_amount":0,
                  "isValid":true
              },
              {
                  "amount":"2000000",
                  "activity_id":1442412,
                  "gfs_code_id":37,
                  "funding_source_id":5,
                  "gl":"087-2005-03075-508D-0000000-10665808-108-0000-ES1-ES1613-1-00000-80E-21112108",
                  "facility_id":20609,
                  "financial_year_id":6,
                  "fund_type_id":1,
                  "created_at":"2021-07-26 09:41:40",
                  "updated_at":"2021-07-26 09:41:40",
                  "deleted_at":null,
                  "allocation":null,
                  "expenditure":"1506000",
                  "muse_gl":null,
                  "id":1092013,
                  "budget_category":"BA",
                  "activity":"To support Payment of cleanliness and security workers quarterly by June 2022",
                  "gfs":"Local Staff Salaries",
                  "total_allocated":"1506000",
                  "allocation_amount":0,
                  "isValid":true
              },
              {
                  "amount":"300000",
                  "activity_id":1442408,
                  "gfs_code_id":40,
                  "funding_source_id":5,
                  "gl":"087-2005-03075-508D-0000000-10665808-108-0000-ES5-ES5633-1-00000-80E-21113103",
                  "facility_id":20609,
                  "financial_year_id":6,
                  "fund_type_id":1,
                  "created_at":"2021-07-26 09:41:40",
                  "updated_at":"2021-07-26 09:41:40",
                  "deleted_at":null,
                  "allocation":null,
                  "expenditure":"80000",
                  "muse_gl":null,
                  "id":1092017,
                  "budget_category":"BA",
                  "activity":"To support administrative logistics of health centre by June 2022",
                  "gfs":"Extra-Duty",
                  "total_allocated":"80000",
                  "allocation_amount":0,
                  "isValid":true
              },
              {
                  "amount":"180000",
                  "activity_id":1442408,
                  "gfs_code_id":91,
                  "funding_source_id":5,
                  "gl":"087-2005-03075-508D-0000000-10665808-108-0000-ES5-ES5633-1-00000-80E-22002101",
                  "facility_id":20609,
                  "financial_year_id":6,
                  "fund_type_id":1,
                  "created_at":"2021-07-26 09:41:40",
                  "updated_at":"2021-07-26 09:41:40",
                  "deleted_at":null,
                  "allocation":null,
                  "expenditure":"150000",
                  "muse_gl":null,
                  "id":1092015,
                  "budget_category":"BA",
                  "activity":"To support administrative logistics of health centre by June 2022",
                  "gfs":"Electricity",
                  "total_allocated":"150000",
                  "allocation_amount":0,
                  "isValid":true
              },
              {
                  "amount":"2000000",
                  "activity_id":1442373,
                  "gfs_code_id":105,
                  "funding_source_id":5,
                  "gl":"087-2005-03075-508D-0000000-10665808-108-0000-CS9-CS9396-1-00000-80E-22004102",
                  "facility_id":20609,
                  "financial_year_id":6,
                  "fund_type_id":1,
                  "created_at":"2021-07-26 09:41:40",
                  "updated_at":"2021-07-26 09:41:40",
                  "deleted_at":null,
                  "allocation":null,
                  "expenditure":0,
                  "muse_gl":null,
                  "id":1092012,
                  "budget_category":"BA",
                  "activity":"To procure medicine, medical equipment, hospital, laboratory and dental supplies quarterly by June 2022",
                  "gfs":"Drugs and Medicines",
                  "total_allocated":0,
                  "allocation_amount":0,
                  "isValid":true
              },
              {
                  "amount":"1000000",
                  "activity_id":1442373,
                  "gfs_code_id":108,
                  "funding_source_id":5,
                  "gl":"087-2005-03075-508D-0000000-10665808-108-0000-CS9-CS9396-1-00000-80E-22004105",
                  "facility_id":20609,
                  "financial_year_id":6,
                  "fund_type_id":1,
                  "created_at":"2021-07-26 09:41:40",
                  "updated_at":"2021-07-26 09:41:40",
                  "deleted_at":null,
                  "allocation":null,
                  "expenditure":0,
                  "muse_gl":null,
                  "id":1092011,
                  "budget_category":"BA",
                  "activity":"To procure medicine, medical equipment, hospital, laboratory and dental supplies quarterly by June 2022",
                  "gfs":"Hospital Supplies",
                  "total_allocated":0,
                  "allocation_amount":0,
                  "isValid":true
              },
              {
                  "amount":"1920000",
                  "activity_id":1442408,
                  "gfs_code_id":148,
                  "funding_source_id":5,
                  "gl":"087-2005-03075-508D-0000000-10665808-108-0000-ES5-ES5633-1-00000-80E-22010105",
                  "facility_id":20609,
                  "financial_year_id":6,
                  "fund_type_id":1,
                  "created_at":"2021-07-26 09:41:40",
                  "updated_at":"2021-07-26 09:41:40",
                  "deleted_at":null,
                  "allocation":null,
                  "expenditure":0,
                  "muse_gl":null,
                  "id":1092016,
                  "budget_category":"BA",
                  "activity":"To support administrative logistics of health centre by June 2022",
                  "gfs":"Per Diem - Domestic",
                  "total_allocated":0,
                  "allocation_amount":0,
                  "isValid":true
              },
              {
                  "amount":"1049760",
                  "activity_id":1764232,
                  "gfs_code_id":1114,
                  "funding_source_id":5,
                  "gl":"087-2005-03075-508D-0000000-10665808-108-0000-ES4-ES4402-6-00000-80E-31462101",
                  "facility_id":20609,
                  "financial_year_id":6,
                  "fund_type_id":1,
                  "created_at":"2021-09-07 08:23:27",
                  "updated_at":"2021-09-07 08:23:27",
                  "deleted_at":null,
                  "allocation":null,
                  "expenditure":0,
                  "muse_gl":null,
                  "id":1338539,
                  "budget_category":"CF",
                  "activity":"To support administrative logistic of health facility by September 2021",
                  "gfs":"Transportation Equipment",
                  "total_allocated":0,
                  "allocation_amount":0,
                  "isValid":true
              }
            ],
            "total_budget":8549760
        }}
        data.items = bgData.bgdata;
        // search({ name: id.name }).then((response: AxiosResponse) => {
        //   data.items = response.data.data.data;
        // });
      }
    };

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
    };
  },
});
</script>

<style scoped></style>
