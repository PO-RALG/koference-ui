/* eslint-disable prettier/prettier */
<template>

 <div class="academic-year">
    <v-card-actions class="pa-0">
      <h2>{{ data.title }}</h2>
      <v-spacer></v-spacer>
    </v-card-actions>

  <v-data-table
    :headers="data.headers"
    :items="data.items"
    :single-expand="data.singleExpand"
    :expanded.sync="data.expanded"
    item-key="id"
    show-expand
    class="elevation-1"
  >
    <template v-slot:top>
     
    </template>
    <template v-slot:expanded-item="{ item }">

      <td class="pb-5">
            <b>Code:</b>
            {{ item.code }}
            <br />
            Name:
            <em>
              <b>{{ item.description }}</b>
            </em>
            <v-card outlined flat max-width="100%">
              <v-data-table
                :headers="data.gfsCodes"
                :items="item.gfs_codes"
                hide-default-footer
                dense
              >
      </v-data-table>
        </v-card>
      </td>
    </template>
  </v-data-table>
 </div>
</template>
 
<script lang="ts">
import { defineComponent, reactive, onMounted } from "@vue/composition-api";
import { get } from "../gfs-categories/service/gfs-categories.service";

export default defineComponent({
  setup() {
    let dataItems: Array<any> = [];
    let formData: any = {};
    let data = reactive({
      expanded: [],
      singleExpand: false,
      title: "GFS Categories",
      modalTitle: "",
      headers: [
        { text: "Code", value: "code" },
        { text: "Description", align: "start", sortable: false, value: "description" },
      ],

      gfsCodes: [
        { text: "Code", width:1000, value: "code" },
        { text: "Name", width:500,value: "name" },
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
        console.log("Peter:", response.data.data.data);
      data.items = response.data.data.data;
      });
    });

    return {
      data,
    };
  },
});
</script>

<style scoped></style>
