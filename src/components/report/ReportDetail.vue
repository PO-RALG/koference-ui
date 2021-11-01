<template>
  <v-container v-if="data.report.template_uri">
    <h2>
      Report Details for <span class="">{{ location.name }}</span>
    </h2>
    <br />
    <v-card elevation="1">
      <v-card-text class="mt-n8">
        <v-form ref="form">
          <v-container>
            <v-row class="mt-n8">
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete
                  v-model="data.formData.calendar_year"
                  class="pr-2 pt-6 my-input"
                  dense
                  clearable
                  item-text="name"
                  item-value="id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12">
                <v-select
                  :items="data.formats"
                  v-model="data.exportFormat"
                  :item-value="'id'"
                  label="Report Format"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="mt-n8">
              <v-col cols="12" lg="6" md="6" sm="12">
                <v-select
                  :items="data.academicYears"
                  :item-text="'name'"
                  v-model="data.formData.academic_year_id"
                  :item-value="'id'"
                  label="Academic Year"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <pre>{{ location }}</pre>
      </v-card-text>
      <v-card-actions class="mr-5 mt-n10">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" :disabled="false" text @click="printReport"> DOWNLOAD REPORT </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script charset="utf-8">
import { defineComponent } from "@vue/composition-api";
import { useReport } from "./composables/use-report";
export default defineComponent({
  setup() {
    const { data, printReport, location } = useReport();

    return {
      data,
      printReport,
      location,
    };
  },
});
</script>
