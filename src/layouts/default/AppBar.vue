<template>
  <div>
    <v-app-bar fixed height="130px" elevation="0" color="#052f69">
      <div class="pl-10 d-none d-md-flex">
        <img class="coat" :src="coat" />
      </div>
      <div class="pl-10 d-md-none">
        <img class="coat2" :src="coat" />
      </div>
      <!-- <el-col class="d-md-none" :md="12"> IPHCC </el-col> -->

      <h1 class="font-weight-bold text-1 basil--text pl-10 d-md-none">IPHCC</h1>
      <el-col class="d-none d-md-flex">
        <h1 class="font-weight-bold text-1 basil--text pl-3">
          International Primary Health Care Conference
        </h1>
      </el-col>
      <!-- Align buttons to the right -->
      <v-spacer></v-spacer>
      <el-button
        icon
        @click="toggleDrawer"
        class="d-md-none"
        style="color: black"
      >
        <i class="el-icon-menu"></i>
      </el-button>

      <div class="d-none d-md-flex margin-right">
        <v-btn class="font-weight-bold text-3 basil--text" text @click="goHome"
          ><h3 class="font-weight-bold text-3 basil--text">Home</h3></v-btn
        >
        <v-btn
          class="font-weight-bold text-3 basil--text"
          text
          @click="handleButtonClick2"
          ><h3 class="font-weight-bold text-3 basil--text">About</h3></v-btn
        >
        <v-btn
          class="font-weight-bold text-3 basil--text"
          text
          @click="handleButtonClick1"
          ><h3 class="font-weight-bold text-3 basil--text">Register</h3></v-btn
        >
        <v-btn
          class="font-weight-bold text-3 basil--text"
          text
          @click="handleButtonAbstract"
          ><h3 class="font-weight-bold text-3 basil--text">Abstract</h3></v-btn
        >
        <v-btn
          class="font-weight-bold text-3 basil--text"
          text
          @click="handleButtonClick3"
          ><h3 class="font-weight-bold text-3 basil--text">Login</h3></v-btn
        >
      </div>
      <div class="backdrop" @click="closeDrawer" v-if="drawer"></div>
      <v-navigation-drawer
        app
        temporary
        left
        width="70%"
        :value="drawer"
        @input="drawer = $event"
        absolute
      >
        <template v-slot:prepend>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img :src="coat" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>IPHC Conference</v-list-item-title>
              <!-- <v-list-item-subtitle>Tanzania</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="handleItemClick(item.method)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
              <v-list-item-title class="pl-5 pt-1">{{
                item.title
              }}</v-list-item-title>
            </v-list-item-icon>

            <!-- <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content> -->
          </v-list-item>
        </v-list>
        <v-footer app class="mb-10">
          <v-sheet color="primary" dark>
            <v-container>
              <v-row>
                <v-col cols="6" class="text-right">
                  <!-- Social media icons with links -->
                  <v-btn icon>
                    <a
                      href="https://www.facebook.com/TAMISEMI/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <v-icon color="white">mdi-facebook</v-icon>
                    </a>
                  </v-btn>

                  <v-btn icon>
                    <a
                      href="https://twitter.com/or_tamisemi?lang=en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <v-icon color="white">mdi-twitter</v-icon>
                    </a>
                  </v-btn>

                  <v-btn icon>
                    <a
                      href="https://www.instagram.com/ortamisemi/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <v-icon color="white">mdi-instagram</v-icon>
                    </a>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-footer>
      </v-navigation-drawer>
    </v-app-bar>

    <v-container class="mt-top">
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false, // Initial state of the navigation drawer
      registrationDialog: false, // Initialize registrationDialog to false
      coat: "/coat_of_arms.svg.png",
      items: [
        { title: "Home", icon: "mdi-home", method: "home" },
        { title: "About", icon: "mdi-information", method: "abput" },
        {
          title: "Register",
          icon: "mdi-registered-trademark",
          method: "registr",
        },
        {
          title: "Absrtact",
          icon: "mdi-book-edit-outline",
          method: "abstarct",
        },
        { title: "Login", icon: "mdi-login", method: "login" },
      ],
    };
  },
  methods: {
    handleItemClick(item) {
      if (item === "home") {
        this.$router.push({ path: "/login" });
        data.drawer = false;
      }
      if (item === "abput") {
        this.$router.push({ path: "/about-page" });
        data.drawer = false;
      }
      if (item === "registr") {
        this.$router.push({ path: "/registration-page" });
        data.drawer = false;
      }
      if (item === "abstarct") {
        this.$router.push({ path: "/abstract-page" });
        data.drawer = false;
      }
      if (item === "login") {
        this.$router.push({ path: "/authentication" });
        data.drawer = false;
      }
    },
    closeDrawer() {
      this.drawer = false;
    },
    toggleDrawer() {
      this.drawer = !this.drawer; // Toggle the state of the navigation drawer
    },
    goHome() {
      // Use the Vue Router to navigate to the home route
      this.$router.push({ path: "/login" });
    },
    handleButtonClick1() {
      this.$router.push({ path: "/registration-page" });

      // this.registrationDialog = true;
      // Handle the first button click
    },
    handleButtonClick2() {
      this.$router.push({ path: "/about-page" });
    },
    handleButtonClick3() {
      this.$router.push({ path: "/authentication" });
    },
    handleButtonAbstract() {
      this.$router.push({ path: "/abstract-page" });
    },
  },
};
</script>

<style scoped>
.mt-top {
  margin-top: 80px;
}

.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #f3f5f5 !important;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.link {
  margin: 10px;
}
.link.active {
  background-color: rgb(0, 174, 255);
  color: white;
}
.color-app {
  color: #616667;
}

.coat {
  /* border-radius: 30%; */
  height: 70px;
  width: 70px;
  /* border: 4px solid rgb(242, 248, 248); */
}
.coat2 {
  width: 10%;
  height: 10%;
  border-radius: 30%;
  height: 50px;
  width: 50px;
  border: 4px solid rgb(242, 248, 248);
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
.card {
  cursor: pointer;
}
</style>
