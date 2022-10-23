<template>
  <div>
    <v-card-actions class="pa-0">
      <h2 v-if="data.role">Add Permissions to {{ data.role.name }}</h2>
      <v-spacer></v-spacer>
      <div class="button-container mr-2">
        <v-btn color="primary" @click="goBack" class="mr-2">
          <v-icon>mdi-arrow-u-left-top</v-icon>
          Back
        </v-btn>
        <v-btn
          color="primary"
          @click="addPermissions"
          :disabled="cant('addPermissions', 'AuthRole')"
        >
          <v-icon>mdi-plus</v-icon>
          Save
        </v-btn>
      </div>
    </v-card-actions>
    <v-layout row wrap v-if="permissions">
      <v-flex
        xs2
        v-for="permission in permissions"
        :key="permission.id"
        class="mb-5"
      >
        <PermissionList
          :item="permission"
          :selected="data.selected"
          @itemSelected="addToSelection"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRolePermission } from "./composables/role-permission";
import PermissionList from "./PermissionList.vue";

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
  setup(_props, context) {
    const {
      data,
      addToSelection,
      addPermissions,
      permissions,
      filterPermissions,
      goBack,
    } = useRolePermission(context);

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
<style lang="scss">
.button-container {
  position: fixed;
  z-index: 7;
  right: 0;
}
</style>
