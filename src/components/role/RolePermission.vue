<template>
  <div>
    <v-card-actions class="pa-0">
      <h2 v-if="data.role">Add Permissions to {{ data.role.name }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="goBack">
        <v-icon>mdi-arrow-u-left-top</v-icon>
        Back
      </v-btn>
      <v-btn color="primary" @click="addPermissions" v-if="can('Add Permissions', 'AuthRole'" )>
        <v-icon>mdi-plus</v-icon>
        Save
      </v-btn>
    </v-card-actions>
    <v-layout row wrap v-if="permissions">
      <v-flex xs2 v-for="permission in permissions" :key="permission.id" class="mb-5">
        <PermissionList :item="permission" :selected="data.selected" @itemSelected="addToSelection" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "@vue/composition-api";
import { AxiosResponse } from "axios";
import { find, getPermissions, addPermissions as assignPermissions } from "./services/role-services";
import PermissionList from "./PermissionList.vue";
import router from "@/router";

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
    let data = reactive({
      valid: true,
      role: null,
      selected: [],
      permissions: [],
    });

    onMounted(() => {
      const roleID: any = attrs.id;
      find(roleID).then((response: AxiosResponse) => {
        data.role = response.data.data;
        data.selected = response.data.data.permisions;
      });

      getPermissions({}).then((response: AxiosResponse) => {
        data.permissions = response.data.data;
      });
    });

    const addToSelection = (item: any) => {
      console.log("item", item);
      let idx = data.selected.indexOf(item);
      if (idx > -1) {
        data.selected.splice(idx, 1);
      } else {
        data.selected.push(item);
      }
    };

    const addPermissions = () => {
      let payload = {
        role_id: attrs.id,
        permissions: data.selected.map((val) => val.id),
      };
      assignPermissions(payload).then((response) => {
        console.log(response);
      });
    };

    const goBack = () => {
      router.push({ path: `/roles` });
    };

    let permissions = computed(() => {
      return data.permissions;
    });

    const filterPermissions = (name?) => {
      if (name) {
        permissions.value.filter((entry: any) => entry.resource.includes(name));
        return permissions;
      } else {
        return permissions;
      }
    };

    return {
      data,
      addToSelection,
      addPermissions,
      permissions,
      filterPermissions,
      goBack,
    };
  },
});
</script>
