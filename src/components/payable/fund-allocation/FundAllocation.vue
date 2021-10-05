<template>
  <div class="Fund Allocation">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-card>
      <v-form>
        <v-card-title>
          <v-col cols="12" sm="12" md="3" class="pa-0">
            <v-select
              v-model="data.code"
              :items="data.fundingSources"
              item-value="code"
              label="Funding source"
              @change="searchBudgets(data.code)"
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
            <v-text-field v-model="data.itemUnallocated.carryover" label="Carryover Fund" disabled></v-text-field>
          </v-col>
          <v-col cols="6" sm="12" md="2" v-if="data.items.length">
            <v-text-field v-model="data.itemUnallocated.current" label="Current Fund" disabled></v-text-field>
          </v-col>
          <v-col cols="6" sm="12" md="2" v-if="data.items.length">
            <v-text-field v-model="data.itemUnallocated.total" label="Total Fund" disabled></v-text-field>
          </v-col>
          <v-col cols="6" sm="12" md="2" v-if="data.items.length">
            <v-text-field v-model="data.allocated" label="Total Allocated" disabled></v-text-field>
          </v-col>
          <v-col cols="6" sm="12" md="2" v-if="data.items.length">
            <v-text-field v-model="data.running_balance" label="Unallocated Amount" disabled>
              <v-icon v-if="data.running_balance > 0" slot="append" color="green">mdi-check</v-icon>
              <v-icon v-if="data.running_balance < 0" slot="append" color="red">mdi-close</v-icon>
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-text>
          <template v-if="data.items.length">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      GL Account
                    </th>
                    <th class="text-left">
                      Budget
                    </th>
                    <th class="text-left">
                      Allocated
                    </th>
                    <th class="text-left">
                      Expenditure
                    </th>
                    <th class="text-left">
                      Available
                    </th>
                    <th class="text-left">
                      Allocate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in data.items"
                    :key="i.id"
                  >
                    <td>
                      {{item.code}} <br>
                      <span style="color:teal">{{item.activity.description}}</span> <br>
                      {{item.gfsCode.name}} <br>
                    </td>
                    <td>{{item.budget}}</td>
                    <td>{{item.total_allocated}}</td>
                    <td>{{item.expenditure}}</td>
                    <td>{{item.total_allocated - item.expenditure}}</td>
                    <td>
                      <v-text-field v-model="item.allocation_amount" @input="newAllocation(item.allocation_amount)" type="number"></v-text-field>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </template>
          
        </v-card-text>
        <v-card-actions v-if="data.items.length" class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save">
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
    } = useFundAllocation();

    return {
      data,
      save,
      searchFundingSources,
      searchBudgets,
      newAllocation,
    };
  },
});
</script>

<style scoped></style>
