/* eslint-disable prettier/prettier */
<template>
  <div class="meta-data-category">
    <v-card-actions class="pa-0">
      <h2>Manage GFS Categories</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary">
        <v-icon>mdi-plus</v-icon>
        {{ "ADD NEW" }}
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-data-table
        :headers="data.headers"
        :items="data.items"
        class="elevation-1"
        item-key="id"
        :expanded.sync="data.expanded"
        :single-expand="true"
      >
        <template v-slot:top>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="12" md="4" class="pa-0">
              <v-text-field
                class
                clearable
                flat
                hide-details
                prepend-icon="mdi-magnify"
                label="Search by Category Name"
              ></v-text-field>
            </v-col>
          </v-card-title>
        </template>
        <template v-slot:item="{ item, isExpanded, expand }">
          <tr>
            <td>{{ item.code }}</td>
            <td>{{ item.description }}</td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                    @click="expand(!isExpanded)"
                  >
                    mdi-format-list-bulleted
                  </v-icon>
                </template>
                <span>List of GFS Codes</span>
              </v-tooltip>
            </td>
            <td>
              <v-icon class="mr-2" @click="openDialog(item)">
                mdi-pencil-box-outline
              </v-icon>
              <v-icon @click="openConfirmDialog(item)">
                mdi-trash-can-outline
              </v-icon>
            </td>
          </tr>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pb-5">

            <b class="pl-3">Category Code:</b>
            <b class="pl-5">{{ item.code }}</b>
            <br />
            <span class="pl-3">List of GFS Codes</span>
            <v-card outlined flat max-width="80%">
              <v-data-table
                :headers="data.gfsCodes"
                :items="item.gfs_codes"
                hide-default-footer
                dense
              ></v-data-table>
            </v-card>
          </td>
        </template>
      </v-data-table>
      </v-card>
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
        { text: "GFS Codes List", value: "actions", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
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
