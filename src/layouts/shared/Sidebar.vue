<template>
  <v-navigation-drawer v-model="drawer" app>
    <template v-slot:prepend>
      <v-toolbar-title color="primary" class="sidebar-toolbar d-flex flex-row justify-space-between">
        <h3 class="admin-title">FFARS</h3>
        <v-icon large @click.stop="toggleSidebar" color="white" class="sidebar-close-icon"> mdi-close </v-icon>
      </v-toolbar-title>
    </template>
    <template>
      <v-list-item two-line class="user-banner">
        <v-list-item-avatar class="pl-3">
          <img class="user-avatar" :src="data.user_logo" />
        </v-list-item-avatar>
        <v-list-item-content class="description">
          <h3 class="name">john doe</h3>
          <v-list-item-subtitle>
            <div class="description-title">[SUPER ADMIN]</div>
            <span class="location">[PORALG]</span>
            <br />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-list dense class="menu-container">
      <perfect-scrollbar>
        <template v-for="menu in MENU_ITEMS">
          <v-row v-if="menu.heading" :key="menu.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="!menu.children">
                {{ menu.heading }}
              </v-subheader>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="menu.children"
            :key="menu.title"
            v-model="menu.model"
            :prepend-icon="menu.model ? menu.icon : menu['icon-alt']"
            :append-icon="'mdi mdi-chevron-down'"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ menu.title }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item class="pl-8" v-for="(child, i) in menu.children" :key="i" link router-link :to="child.state">
              <v-list-item-action v-if="child.icon">
                <v-icon small medium>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="menu.title" link router-link :to="menu.state">
            <v-list-item-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-divider></v-divider>
      </perfect-scrollbar>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { reactive } from "@vue/composition-api";
import { MENU_ITEMS } from "../../config/menu-items";

export default Vue.extend({
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
    toggle: {
      type: Function,
      required: false,
    },
  },

  setup(props, context) {
    let data = reactive({
      user_logo: "/coat_of_arms.svg.png",
    });

    const toggleSidebar = () => {
      context.emit("toggle", props.drawer);
    };

    return {
      data,
      MENU_ITEMS,

      toggleSidebar,
    };
  },
});
</script>

<style lang="scss">
@import "../../assets/perfect-scrollbar.css";

.sidebar-toolbar {
  height: 64px;
  color: #fff;
  background-color: rgb(33, 150, 243) !important;
}
.info-toolbar {
  background-color: rgb(21, 101, 192);
  height: 128px;
  min-height: 128px;
  max-height: 128px;
}
.circle {
  border-radius: 50%;
  background: #fff;
  z-index: 1000;
  position: inherit;
  border: 1px solid rgba(52, 73, 94, 0.44);
  padding: 2px;
  box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.2);
}
.user-banner {
  background: rgb(21, 101, 192);
  color: #fff;
  text-align: center;
  padding: 15px 0;
}
.user-info {
  text-transform: uppercase;
  font-size: 12px;
}
.menu-container {
  padding: 0;
}
.v-list {
  padding-top: 0 !important;
}
.sidebar-close-icon {
  margin-right: 14px !important;
}
.admin-title {
  font-family: "Helvetica", "Helvetica", "Arial", sans-serif;
  line-height: 64px;
  margin-left: 10px;
  font-size: 20px !important;
}
.v-avatar {
  border-radius: 50%;
  width: 70px;
  height: 70px;
  border: 6px solid rgba(204, 204, 204, 0.42);
}
.description {
  text-align: left;
  color: #fff;
  .description-title {
    @extend .description;
    font-size: 11px;
    text-transform: uppercase;
    margin: 0 5px 0 0;
    line-height: 15px;
  }
  .location {
    @extend .description;
    text-transform: uppercase;
    font-size: 10px;
    line-height: 15px;
  }
  .name {
    font-size: 12px;
    font-weight: normal;
    text-transform: uppercase;
  }
}
</style>
