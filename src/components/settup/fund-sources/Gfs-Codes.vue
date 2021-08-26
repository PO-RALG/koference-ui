/* eslint-disable prettier/prettier */
<template>
  <div class="academic-year">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>

    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        :server-items-length="data.params.total"
        :options.sync="data.pagination"
        :items-per-page="data.params.size"
        class="elevation-1"
      >
        <template v-slot:[`item.code`]="{ item }">
          <span>{{ item.code }}</span>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { get, } from "../gfs-codes/service/gfs.service";

export default defineComponent({
  setup() {
    let dataItems: Array<any> = [];
    let formData: any = {};
    let data = reactive({
      title: "GFS Codes",
      modalTitle: "",
      headers: [
        { text: "Code", value: "code" },
        { text: "Name", align: "start", sortable: false, value: "name" },
      ],
      modal: false,
      items: dataItems,
      formData,
      params: {
        total: 100,
        size: 10
      },
    });

    onMounted(() => {
      // make api call
      let params: any = {
        total: 100,
        size: 10
      }
      get(params).then((response: any) => {
      data.items = response.data;
      });
    });

    return {
      data,
    };
  },
});
</script>

<style scoped></style>
