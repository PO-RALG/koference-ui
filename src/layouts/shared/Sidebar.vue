<template>
  <div>
    <div class="d-md-none" @click="closeDrawer">
      <v-navigation-drawer
        app
        left
        width="280px"
        :value="Droower"
        @input="Droower = $event"
        absolute
        v-if="user"
      >
        <template v-slot:prepend>
          <SidebarToolbar @onSidebarClose="toggleSidebar" />
        </template>
        <SidebarUserInfo :user="user" :logoUrl="data.user_logo" />
        <Menu :menuGroups="user.menu_groups" @navigate="navigateToState" />
      </v-navigation-drawer>
    </div>
    <div class="d-none d-md-flex">
      <v-navigation-drawer
        app
        left
        width="280px"
        :value="Droower"
        @input="Droower = $event"
        absolute
        v-if="user"
      >
        <template v-slot:prepend>
          <SidebarToolbar @onSidebarClose="toggleSidebar" />
        </template>
        <SidebarUserInfo :user="user" :logoUrl="data.user_logo" />
        <Menu :menuGroups="user.menu_groups" @navigate="navigateToState" />
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from "vue";
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
      drower: false,
    });

    const Droower = computed(() => {
      return _props.drawer;
    });

    // const xxxx = watch(
    //   () => _props.drawer,
    //   (newDrawerValue) => {
    //     data.drower = newDrawerValue;
    //   }
    // );

    const toggleSidebar = () => {
      console.log("inafika");
      emit("sidebarToggle");
    };
    const closeDrawer = () => {
      console.log("inafika");
      emit("sidebarToggle", _props.drawer);
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
      closeDrawer,
      Droower,
    };
  },
});
</script>
<style>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: none;
}

/* Show the backdrop when the drawer is open */
.v-navigation-drawer[value="true"] + .backdrop {
  display: block;
}
</style>
<style>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: none;
}

/* Show the backdrop when the drawer is open */
.v-navigation-drawer[value="true"] + .backdrop {
  display: block;
}
</style>
<style lang="scss">
@import "../../assets/perfect-scrollbar.css";

.sidebar-toolbar {
  height: 64px;
  color: #fff;
  background-color: #1476d7;
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
  // background: rgb(21, 101, 192);
  background-color: #dcddde;
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
  background-color: teal;
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
.v-navigation-drawer__content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #edf3f5;
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
