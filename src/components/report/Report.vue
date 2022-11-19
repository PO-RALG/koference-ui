<template>
  <div>
    <h2>View Reports</h2>
    <v-row class="top-header d-flex justify-space-between" cols="12">
      <v-col cols="12" sm="12" md="3" class="hierarchy-container elevation-1">
        <v-label><h5>SELECT LOCATION</h5></v-label>
        <TreeBrowser
          @onClick="loadLocationChildren"
          :node="data.node"
          :current-item="data.currentItem"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="3"
        class="hierarchy-container elevation-1"
        v-if="data.location"
      >
        <v-label><h5>SELECT REPORT CATEGORY</h5></v-label>
        <ReportTreeBrowser
          :attachment-icon="data.reportIcon"
          @onClick="loadReportCategories"
          :node="data.report"
          :current-item="data.selectedReport"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <router-view :key="this.$route.fullPath"></router-view>
      </v-col>
    </v-row>

    <info-dialog
      :isInfoDialogOpen="data.isInfoDialogOpen"
      :infoMessage="data.infoMessage"
      :on-close="closeInfoDialog"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useReport } from "./composables/use-report";

export default defineComponent({
  setup(props, context) {
    const {
      data,
      loadLocationChildren,
      loadReportCategories,
      getLocationTree,
      closeInfoDialog,
    } = useReport(props, context);

    return {
      data,
      loadLocationChildren,
      loadReportCategories,
      getLocationTree,
      closeInfoDialog,
    };
  },
});
</script>
