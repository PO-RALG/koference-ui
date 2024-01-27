<template>
  <!-- About page content -->
  <v-container class="mt-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center mb-5 color-title">About Conference Portal</h1>
        <hr class="centered-line" />
        <v-divider class="mb-5"></v-divider>

        <!-- Sample about content -->
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="headline mb-2">Our Mission</v-card-title>
              <v-card-text>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  sagittis arcu in elit accumsan, et venenatis justo volutpat.
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="headline mb-2">Our Vision</v-card-title>
              <v-card-text>
                <p>
                  Sed euismod sapien at velit cursus, a efficitur libero
                  accumsan. Vivamus eleifend metus nec elit euismod, nec finibus
                  purus sodales.
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="headline mb-2">Our Values</v-card-title>
              <v-card-text>
                <p>
                  Proin vel lectus eu libero efficitur luctus. Integer ut
                  accumsan orci, nec gravida nunc. Vestibulum congue erat ut
                  hendrerit venenatis.
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "App",
  methods: {
    goHome() {
      this.$router.push({ path: "/" });
    },
    goAbout() {
      this.$router.push({ path: "/about" });
    },
    handleButtonClick1() {
      // Handle the first button click
    },
  },
};
</script>

<style>
/* Add your custom styles here */
.color-title {
  color: grey;
}
.centered-line {
  width: 25%;
  border: 3px solid grey; /* Adjust thickness as needed */
  margin: 8px auto; /* Adjust as needed */
}
</style>
