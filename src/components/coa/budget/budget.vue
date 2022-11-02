<template>
  <div class="financial-year">
    <v-container>
      <v-row>
        <v-col cols="7" md="7" class="d-flex">
          <v-select
            :items="data.councils"
            :item-text="'description'"
            v-model="data.councilId"
            label="Select Council"
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
                    outlined
                    label="Search Council"
                    @keyup="filterLocation()"
                    :items="data.itemsToFilter"
                    v-model="data.searchTerm"
                    clearable
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="4" md="4">
          <v-btn color="primary" @click="getData">
            <v-icon>mdi-sync</v-icon>
            Get Budget
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useBudget } from "./composables/budget";

export default defineComponent({
  name: "Budget",
  setup() {
    const { data, getData, getCouncils, filterLocation } = useBudget();

    return {
      getData,
      getCouncils,
      data,
      filterLocation,
    };
  },
});
</script>

<style scoped></style>
