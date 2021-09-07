<template>
  <v-navigation-drawer v-model="drawer" app v-if="user">
    <template v-slot:prepend>
      <v-toolbar-title color="primary" class="sidebar-toolbar d-flex flex-row justify-space-between">
        <h3 class="admin-title">FFARS</h3>
        <v-icon large @click.stop="toggleSidebar" color="white" class="sidebar-close-icon"> mdi-close </v-icon>
      </v-toolbar-title>
    </template>
    <template>
      <v-toolbar-title color="primary" class="user-banner d-flex flex-row justify-start">
        <v-row>
          <v-layout justify-center align-center>
            <v-col cols="4" class="text-left ml-5">
              <img class="user-avatar" :src="data.user_logo" />
            </v-col>
            <v-col cols="8" class="text-left pl-0 mt-n2">
              <div class="description">
                <h3 class="name">{{ fullName }}</h3>
                <div class="description-title">
                  <a href="#">[{{ roleName }}]</a>
                </div>
                <div class="location">
                  <a href="#">({{ location }})</a>
                </div>
              </div>
            </v-col>
          </v-layout>
        </v-row>
      </v-toolbar-title>
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
import { defineComponent, reactive, computed } from "@vue/composition-api";
import { MENU_ITEMS } from "@/config/menu-items";

export default defineComponent({
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
    toggle: {
      type: Function,
      required: false,
    },
    user: {
      type: Object,
      required: true,
    },
  },

  setup(props, context) {
    let data = reactive({
      user_logo: "/coat_of_arms.svg.png",
    });

    const toggleSidebar = () => {
      context.emit("toggle", props.drawer);
    };

    const fullName = computed(() => {
      return `${props.user.first_name} ${props.user.last_name}`;
    });

    const roleName = computed(() => {
      if (props.user.roles) {
        return props.user.roles[0].name;
      } else {
        return "NO ROLE";
      }
    });

    const location = computed(() => {
      if (props.user.location) {
        return props.user.location.name;
      } else {
        ("NO LOCATION");
      }
    });

    return {
      data,
      fullName,
      roleName,
      location,
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
  padding: 10px 0;
  height: 128px;
  min-height: 128px;
  max-height: 128px;
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
h3.admin-title {
  line-height: 64px;
  margin-left: 10px;
  font-size: 20px !important;
  color: #fff;
  padding: 0 !important;
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
    font-size: 15px;
    text-transform: uppercase;
    margin: 0 5px 0 0;
    line-height: 15px;
  }
  .location {
    @extend .description;
    text-transform: uppercase;
    font-size: 15px;
    line-height: 15px;
  }
  h3.name {
    font-size: 13px;
    font-weight: normal;
    text-transform: uppercase;
    font-weight: normal;
    color: #fff;
    padding: 0;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
}
.user-avatar {
  border-radius: 50%;
  height: 70px;
  width: 70px;
  border: 6px solid rgba(204, 204, 204, 0.42);
}
</style>
