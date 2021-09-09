<template>
  <div>
    <v-card-actions class="pa-0">
      <h2 v-if="data.menu">Add Permissions to {{ data.menu.name }} Menu Item</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="goBack">
        <v-icon>mdi-arrow-u-left-top</v-icon>
        Back
      </v-btn>
      <v-btn color="primary" @click="addPermissions">
        <v-icon>mdi-plus</v-icon>
        Save
      </v-btn>
    </v-card-actions>
    <v-card>
      <v-row>
        <v-col cols="12" lg="6" md="6" sm="12" class="pl-10">
          <v-select
            item-text="category"
            v-model="data.selectedCategory"
            :items="data.categories"
            @input="getPermissions"
            return-object
            label="Select Resource Category"
          >
          </v-select>
        </v-col>
        <v-col cols="12" lg="6" md="6" sm="12" class="pl-10">
          <PermissionList
            v-if="data.category"
            :item="data.category"
            :columnName="'permissions'"
            :selected="data.selected"
            @itemSelected="addToSelection"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import PermissionList from "@/components/role/PermissionList.vue";
import router from "@/router";

import {
  find,
  getResourceCategories,
  getPermissionsByResource,
  addPermissions as assignPermissions,
} from "./services/menu.service";

export default defineComponent({
  components: {
    PermissionList,
  },
  props: {
    role: {
      type: Object,
      required: false,
    },
  },
  setup(props, { attrs }) {
    const TYPE = "MENU_ITEM";
    let data = reactive({
      valid: true,
      menu: null,
      categories: [],
      category: null,
      selected: [],
      selectedCategory: null,
      permissions: [],
    });

    onMounted(() => {
      const menuID: any = attrs.id;
      find(menuID, TYPE).then((response: AxiosResponse) => {
        data.menu = response.data.data;
        data.selected = response.data.data.permisions;
      });

      getResourceCategories({ categories: true }).then((response: AxiosResponse) => {
        data.categories = response.data.data;
      });
    });

    const addToSelection = (item: any) => {
      let idx = data.selected.indexOf(item);
      if (idx > -1) {
        data.selected.splice(idx, 1);
      } else {
        data.selected.push(item);
      }
    };

    const addPermissions = () => {
      let payload = {
        menu_id: attrs.id,
        permissions: data.selected.map((val) => val.id),
      };

      assignPermissions(payload).then((response: AxiosResponse) => {
        if (response.status == 200) {
          router.push({ path: `/menu-items` });
        }
      });
    };

    const goBack = () => {
      router.push({ path: `/menu-items` });
    };

    const getPermissions = (val) => {
      let { id, category } = val;
      getPermissionsByResource(id, category).then((response) => {
        data.category = response.data.data;
      });
    };

    return {
      data,
      addToSelection,
      addPermissions,
      getPermissions,
      goBack,
    };
  },
});
</script>
