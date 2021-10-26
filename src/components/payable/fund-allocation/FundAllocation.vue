<template>
  <div class="Fund Allocation">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-form v-model="data.valid">
        <v-card-title>
          <v-col cols="12" sm="12" md="3" class="pa-0">
            <v-select
              :items="data.fundingSources"
              label="Funding source"
              @change="searchBudgets($event)"
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
          <v-col cols="6" sm="12" md="1" v-if="data.items.length">
            <v-text-field 
              v-model="data.itemUnallocated.carryover"
              label="Carryover Fund"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="12" md="2" v-if="data.items.length">
            <v-text-field 
              v-model="data.itemUnallocated.current"
              label="Current Fund"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="12" md="2" v-if="data.items.length">
            <v-text-field
              v-model="data.itemUnallocated.totalFund"
              label="Total Fund"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="12" md="2" v-if="data.items.length">
            <v-text-field
              v-model="data.allocated"
              label="Total Allocated"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="12" md="2" v-if="data.items.length">
            <v-text-field
              v-model="data.running_balance"
              label="Unallocated Amount"
              disabled
            >
              <v-icon
                v-if="data.running_balance > 0"
                slot="append"
                color="green"
                >mdi-check</v-icon
              >
              <v-icon v-if="data.running_balance < 0" slot="append" color="red"
                >mdi-close</v-icon
              >
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-text class="data-table">
          <v-data-table
            :headers="data.headers"
            disable-pagination
            hide-default-footer
            v-if="data.items.length"
          >
            <template v-slot:body>
              <tbody>
                <tr v-for="(item, i) in data.items" :key="i">
                  <td class="pt-5 pb-2">
                    {{ item.code }} <br />
                    <span style="color: teal">{{
                      item.activity.description
                      }}</span>
                    <br />
                    {{ item.gfsCode.name }}
                  </td>
                  <td class="">{{ item.budget }}</td>
                  <td class="">{{ item.allocation }}</td>
                  <td class="">{{ item.totalExpenditure }}</td>
                  <td class="">{{ item.allocation - item.totalExpenditure }}</td>
                  <td class="pt-5">
                    <v-text-field
                      dense
                      outlined
                      :rules="[maxRules(item.budget - item.allocation)]"
                      v-model="item.allocation_amount"
                      @input="newAllocation(item.allocation_amount)"
                      type="number"
                    ></v-text-field>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!data.valid"
            color="primary"
            @click="save"
            v-if="data.items.length"
          >
            save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useFundAllocation } from "./composables/fund-allocation";

export default defineComponent({
  name: "FundAllocation",
  setup() {
    const {
      data,
      save,
      searchFundingSources,
      searchBudgets,
      newAllocation,
      maxRules,
    } = useFundAllocation();

    return {
      data,
      save,
      searchFundingSources,
      searchBudgets,
      newAllocation,
      maxRules,
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
</style>

