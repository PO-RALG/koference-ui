<template>
  <v-container>
    <h2 v-if="data.location && data.currentReport">
      <span class="">{{ data.currentReport.name }} Report for {{ data.location.name }}</span>
    </h2>
    <br />
    <v-card elevation="1">
      <v-card-text class="mt-n8">
        <v-form ref="form">
          <v-layout row wrap v-if="reportParams">
            <v-flex
              xs6
              v-for="component in reportParams"
              :key="component.id"
              class="mb-5 pl-5 pr-5">
              <div v-if="!component.needsApiCall">
                <DatePicker
                  :label="component.description"
                  v-model="data.formData[component.name]"
                />
              </div>
              <fetcher v-else :api="component.api">
              <div slot-scope="{ json: items, loading }">
                <div v-if="loading">Loading...</div>
                <BaseSelect
                  v-else
                  :items="items"
                  :item-text="'name'"
                  :label="component.description"
                  v-model="data.formData[component.name]"
                  />
              </div>
              </fetcher>
            </v-flex>
          </v-layout>
        </v-form>
        <!--<pre>{{ data.formData }}</pre>-->
      </v-card-text>
      <v-card-actions class="mr-5 mt-n10">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" :disabled="false" text>PRINT REPORT</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script charset="utf-8">
import { defineComponent } from "@vue/composition-api";
import { useReportDetail } from "./composables/use-report-detail";
export default defineComponent({
  setup() {
    const { data, reportParams } = useReportDetail();

    return {
      data,
      reportParams,
    };
  },
});
</script>
