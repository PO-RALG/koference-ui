<template>
  <v-navigation-drawer v-model="drawer" width="280px" app v-if="user">
    <template v-slot:prepend>
      <SidebarToolbar @onSidebarClose="toggleSidebar" />
    </template>
    <SidebarUserInfo :user="user" :logoUrl="data.user_logo" />
    <Menu :menuGroups="user.menu_groups" @navigate="navigateToState" />
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import router from "@/router";
import SidebarToolbar from "./SidebarToolbar.vue";
import SidebarUserInfo from "./SidebarUserInfo.vue";
import Menu from "./Menu.vue";

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: true,
    },
    sidebarToggle: {
      type: Function,
      required: false,
    },
    drawer: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    SidebarToolbar,
    SidebarUserInfo,
    Menu,
  },

  setup(_props, { emit }) {
    const isOpen = ref(false);
    const data = reactive({
      user_logo: "/coat_of_arms.svg.png",
      mini: false,
    });

    const toggleSidebar = () => {
      emit("sidebarToggle");
    };

    const navigateToState = (state: any) => {
      if (state && typeof state == "object") {
        router.push({ path: "/" }).catch((error) => {
          if (error.name !== "NavigationDuplicated") {
            throw error;
          }
        });
      } else {
        router.push({ path: `/${state}` }).catch((error) => {
          if (error.name !== "NavigationDuplicated") {
            throw error;
          }
        });
      }
    };

    return {
      data,
      location,
      navigateToState,
      toggleSidebar,
      isOpen,
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
  color: #ddd;
  text-align: center;
  padding: 10px 0 0 0;
  height: 100px;
  min-height: 100px;
  max-height: 100px;
}
.location-banner {
  background: rgb(21, 101, 192);
  color: #ddd;
  text-align: center;
  padding: 5px 0;
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
    font-size: 12px;
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
