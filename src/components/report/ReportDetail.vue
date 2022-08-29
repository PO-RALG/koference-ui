<template>
  <v-container>
    <v-card elevation="2" v-if="data.location && data.currentReport">
      <h2 class="pl-5">
        <span>
          {{ data.currentReport.name }} Report ({{ data.location.name }}
          {{
            data.location.level_id === 1 ? "" : data.location.level.name
          }})</span
        >
      </h2>
      <br />
      <v-card-text class="mt-n8">
        <v-form ref="form" v-model="data.valid">
          <v-layout row wrap v-if="reportParams">
            <v-flex xs6 class="mb-5 pl-5 pr-5" v-if="reportParams.length === 1">
              <v-select
                v-model="data.formData.format"
                label="Select Report Format"
                :items="data.format"
                outlined
              />
            </v-flex>
            <v-flex xs12 class="mb-5 pl-5 pr-5" v-else>
              <v-select
                v-model="data.formData.format"
                label="Select Report Format"
                :items="data.format"
                outlined
              />
            </v-flex>
            <v-flex
              xs6
              v-for="component in reportParams"
              :key="component.id"
              class="mb-5 pl-5 pr-5"
            >
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
                    outlined
                    :required="component.isRequired"
                    v-model="data.formData[component.name]"
                  />
                </div>
              </fetcher>
            </v-flex>
            <v-flex xs6 class="mb-5 pl-5 pr-5">
              <fetcher
                v-if="!isFacility"
                :api="'/api/v1/facilities?' + 'location_id=' + data.location_id"
              >
                <div slot-scope="{ json: items, loading }">
                  <div v-if="loading">Loading...</div>
                  <BaseSelect
                    v-else
                    :items="items"
                    :item-text="'name'"
                    label="Facility"
                    outlined
                    required
                    v-model="data.formData.facility_id"
                  />
                </div>
              </fetcher>
            </v-flex>
          </v-layout>
        </v-form>
        <!--<pre>{{ data.formData }}</pre>-->
      </v-card-text>
      <v-card-actions class="mr-5 mt-n4 pb-5">
        <v-spacer></v-spacer>
        <v-btn color="primary" :disabled="!data.valid" @click="print"
          >PRINT REPORT</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script charset="utf-8">
import { defineComponent } from "@vue/composition-api";
import { useReportDetail } from "./composables/use-report-detail";
export default defineComponent({
  setup(props, context) {
    const { data, reportParams, print, isFacility } = useReportDetail(
      props,
      context
    );

    return {
      data,
      reportParams,
      isFacility,
      print,
    };
  },
});
</script>
