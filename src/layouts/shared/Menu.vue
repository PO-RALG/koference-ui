<template>
  <v-list dense class="menu-container">
    <perfect-scrollbar>
      <template v-for="menu in menuGroups">
        <v-row v-if="menu.heading" :key="menu.heading" align="center">
          <v-col cols="6">
            <v-subheader v-if="!menu.children">{{ menu.name }}</v-subheader>
          </v-col>
        </v-row>
        <v-list-group
          v-else-if="menu.children"
          :key="menu.name"
          v-model="menu.model"
          :prepend-icon="
            menu.icon && menu.children ? menu.icon : menu['icon-alt']
          "
          :append-icon="'mdi mdi-chevron-down'"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ menu.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            class="pl-8"
            v-for="(child, i) in menu.children"
            :key="i"
            @click="$emit('navigate', child.state)"
          >
            <v-list-item-action v-if="child.icon">
              <v-icon small medium>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ child.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item v-else :key="menu.title" @click="goTomenu(menu)">
          <v-list-item-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ menu.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider></v-divider>
    </perfect-scrollbar>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    menuGroups: {
      type: Array,
      default: [],
    },
    navigate: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const goTomenu = (menu: any) => {
      if (menu && menu.id) {
        emit("navigate", menu.state);
      } else {
        emit("navigate", menu);
      }
    };

    return {
      goTomenu,
    };
  },
});
</script>
