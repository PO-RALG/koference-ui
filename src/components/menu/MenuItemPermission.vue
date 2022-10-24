<template>
  <div>
    <v-card-actions class="pa-0">
      <h2 v-if="data.menu">
        Add Permissions to {{ data.menu.name }} Menu Item
      </h2>
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
        <v-col cols="6" lg="2" md="2" sm="12">
          <v-autocomplete
            v-model="data.selectedCategory"
            :loading="data.loading"
            :items="data.categoryOptions"
            :search-input.sync="data.search"
            item-text="category"
            @change="getPermissions"
            cache-items
            class="mx-4"
            flat
            hide-no-data
            hide-details
            return-object
            color="white"
            label="Search Resource name"
            solo-inverted
          ></v-autocomplete>
        </v-col>
        <v-col cols="6" lg="4" md="4" sm="12" class="pl-10">
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
import {
  defineComponent,
  reactive,
  onMounted,
  watch,
  computed,
} from "vue";
import { AxiosResponse } from "axios";
import PermissionList from "@/components/role/PermissionList.vue";
import router from "@/router";
import { useMenuItems } from "./composables/menu-item";

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

  setup(_props, { attrs, emit }) {
    const TYPE = "MENU_ITEM";
    let data = reactive({
      valid: true,
      menu: null,
      loading: false,
      categories: [],
      category: null,
      selected: [],
      selectedCategory: "",
      categoryOptions: [],
    });

    const loadMenuItems = useMenuItems();

    // watchers
    watch(data, (newValue: any) => {
      emit("filterFunction", newValue.search);
    });

    onMounted(() => {
      initialize();
    });

    const initialize = () => {
      const menuID: any = attrs.id;
      find(menuID, TYPE).then((response: AxiosResponse) => {
        data.menu = response.data.data;
        data.selected = response.data.data.permisions;
        response.data.data.permisions.length > 0
          ? (data.selectedCategory = response.data.data.permisions[0].resource)
          : (data.selectedCategory = "");
      });

      getResourceCategories({ categories: true }).then(
        (response: AxiosResponse) => {
          data.categories = response.data.data;
          data.categoryOptions = response.data.data.map((entry) => {
            return entry.category;
          });
        }
      );
    };

    let selectedCategory = computed(() => {
      return data.selectedCategory;
    });

    const categories = computed(() => {
      return data.categories;
    });

    watch([selectedCategory], (newValue) => {
      let [selected] = newValue;
      if (data.categories.length > 0 && !!selected) {
        let { id, category } = data.categories.find(
          (c) => c.category == selected
        );
        data.selectedCategory = category;
        getPermissionsByResource(id, category).then((response) => {
          data.category = response.data.data;
        });
      }
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
          loadMenuItems();
        }
      });
    };

    const goBack = () => {
      router.push({ path: `/manage-menu-items` });
    };

    const getPermissions = (val) => {
      let { id, category } = data.categories.find(
        (cat) => cat.category === val
      );
      data.selectedCategory = category;
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
      selectedCategory,
      categories,
      loadMenuItems,
    };
  },
});
</script>
