<template>
  <div>
    <v-app-bar app height="150" elevation="0" color="#f3f5f5">
      <div class="pl-10">
        <img class="coat" :src="coat" />
      </div>
      <h1 class="display-2 color-app pl-10">Conference Portal</h1>

      <!-- Align buttons to the right -->
      <v-spacer></v-spacer>
      <v-btn class="color-app" icon @click="goHome">
        <v-icon x-large>mdi-home</v-icon>
      </v-btn>
      <v-btn class="color-app" text @click="handleButtonClick2"
        ><h3>About</h3></v-btn
      >
      <v-btn class="color-app" text @click="handleButtonClick1"
        ><h3>Register</h3></v-btn
      >
      <v-btn class="color-app" text @click="handleButtonAbstract"
        ><h3>Abstract</h3></v-btn
      >
      <v-btn class="color-app" text @click="handleButtonClick3"
        ><h3>Login</h3></v-btn
      >
    </v-app-bar>

    <v-container class="mt-12"> </v-container>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      registrationDialog: false, // Initialize registrationDialog to false
      coat: "/coat_of_arms.svg.png",
    };
  },
  methods: {
    goHome() {
      // Use the Vue Router to navigate to the home route
      this.$router.push({ path: "/" });
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

<style>
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
  width: 35%;
  height: 25%;
  border-radius: 30%;
  height: 100px;
  width: 100px;
  border: 4px solid rgb(242, 248, 248);
}
</style>
