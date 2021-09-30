<template>
  <div class="gl-transitions">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>

    <v-card>
      <v-data-table
        :headers="HEADERS"
        :items="entries"
        :single-expand="data.singleExpand"
        item-key="id"
        :expanded.sync="data.expanded"
        show-expand
      >
        <template v-slot:[`item.apply_date`]="{ item }">
          <span>{{ item.end_date | format("DD/MM/YYYY") }}</span>
        </template>
        <template v-slot:[`item.total`]="{ item }">
          <span>{{ item.total | toCurrency }}</span>
        </template>
        <template v-slot:[`expanded-item`]="{ item }">
          <td :colspan="ENTRIES_HEADERS.length" class="pa-2">
            <v-card outlined flat width="100%" max-width="100%">
              <v-data-table
                :headers="ENTRIES_HEADERS"
                :items="item.gl_entries"
                hide-default-footer
                dense
              >
              <template v-slot:[`item.dr_amount`]="{ item }">
                <span>{{ item.dr_amount | toCurrency }}</span>
              </template>
              <template v-slot:[`item.cr_amount`]="{ item }">
                <span>{{ item.cr_amount | toCurrency }}</span>
              </template>
              </v-data-table>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useGLTransaction } from "./composables/gl-transaction";

export default defineComponent({
  setup() {
    const { HEADERS, ENTRIES_HEADERS, data, entries } = useGLTransaction();

    return {
      HEADERS,
      ENTRIES_HEADERS,
      data,
      entries,
    };
  },
});
</script>

<style lang="scss">
tr.v-data-table__expanded__row {
  background: #e5e2e2;
}
</style>
