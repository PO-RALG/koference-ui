<template>
  <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="#052f69">
    <v-app-bar-nav-icon
      color="white"
      large
      @click.stop="toggleSidebar"
    ></v-app-bar-nav-icon>
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4"> </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu
      class="top-menu white"
      max-height="420"
      v-model="data.menu"
      :close-on-content-click="true"
      :nudge-width="250"
      max-width="350"
      offset-y
    >
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click="toggleMenu"
          color="transparent"
          class="text--white elevation-0"
        >
          <v-badge
            :content="messages"
            :value="data.messages"
            :bind="attrs"
            class="mr-5"
            :on="on"
            color="green"
            overlap
          >
            <v-icon medium>mdi-bell-ring-outline</v-icon>
          </v-badge>
        </v-btn>
      </template> -->
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img
                :src="data.avatar"
                class="login-logo"
                @click="toggleUserMenu"
                alt="fullName"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ fullName }}</v-list-item-title>
              <!-- <v-list-item-subtitle>{{ roleName }}</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <div v-for="message in data.messages" :key="message.id">
            <v-list-item>
              <v-list-item-title class="message">
                <a href="#">{{ message.title }}</a>
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
          </div>

          <v-list-item>
            <v-list-item-title class="message font-weight-bold">
              <a href="#">VIEW ALL</a>
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-menu>
    <v-menu
      class="top-menu"
      v-model="data.userMenu"
      :close-on-content-click="true"
      :nudge-width="200"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <img
          :src="data.avatar"
          :bind="attrs"
          :on="on"
          class="login-logo mr-5"
          @click="toggleUserMenu"
          :alt="fullName"
        />
      </template>
      <v-card>
        <v-list class="list-item clickable">
          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              <span>Logout</span>
            </v-list-item-title>
          </v-list-item>
          <!-- <v-divider></v-divider> -->

          <!-- <v-list-item @click="changePassword">
            <v-list-item-action>
              <v-icon>mdi-lock-outline</v-icon>
            </v-list-item-action>
            <v-list-item-title class="clickable">
              <span>Change Password</span>
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item class="list-item">
            <v-list-item-action>
              <v-icon>mdi-cog-outline</v-icon>
            </v-list-item-action>
            <v-list-item-title class="clickable">
              <span>Update Profile</span>
            </v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { computed, reactive, defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
  props: {
    logoutFunction: {
      type: Function,
      required: false,
    },
    sidebarToggle: {
      type: Function,
      required: false,
    },
    drawer: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      messages: [
        { id: 1, title: "You have documents pending for approval" },
        {
          id: 2,
          title:
            "Your documents have been approved, please proceed with the next step",
        },
      ],
      menu: false,
      userMenu: false,
      avatar: "/user.jpeg",
    });

    const toggleSidebar = () => {
      emit("sidebarToggle", props.drawer);
    };

    const logout = () => {
      emit("logoutFunction");
    };

    const messages = computed(() => {
      return data.messages.length;
    });

    const toggleMenu = () => {
      data.menu = !data.menu;
    };

    const toggleUserMenu = () => {
      data.userMenu = !data.userMenu;
    };

    const fullName = computed(() => {
      return `${props.user.first_name} ${props.user.last_name}`;
    });

    // const roleName = computed(() => {
    //   if (props.user.roles) {
    //     return props.user.roles[0].name;
    //   } else {
    //     return "NO ROLE";
    //   }
    // });

    const changePassword = () => {
      const msg = { message: "Change Your Password" };
      store.dispatch("ChangePasswordDialog/SHOW", msg);
    };

    return {
      data,
      toggleSidebar,
      logout,
      messages,
      toggleMenu,
      toggleUserMenu,
      fullName,
      // roleName,
      changePassword,
    };
  },
});
</script>

<style lang="scss" scoped>
.header-toolbar {
  color: #fff;
  background-color: rgb(33, 150, 243) !important;
}

.login-logo {
  border-radius: 50%;
  height: 30px;
  width: 30px;
  border: 2px solid #ccc;
  cursor: pointer;
}

.clickable {
  cursor: pointer;
  a {
    text-decoration: none;
  }
}
.message {
  a {
    text-decoration: none;
  }
}
.v-menu__content {
  top: 64px !important;
}
</style>
