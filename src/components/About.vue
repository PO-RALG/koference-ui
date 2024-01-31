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
          <v-row justify="center">
            <v-col cols="12" md="4">
              <v-card height="330">
                <h3>Our Mission</h3>
                <v-card-text>
                  <p>
                    • To provide scientific proven evidence, innovations and
                    best practices to support evidence-based decision making to
                    policy makers and implementers using available
                    multidisciplinary local and international experts in PHC.
                  </p>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card height="330">
                <h3>Our Vision</h3>

                <v-card-text>
                  <p>
                    • To be an exemplary international conference in sharing
                    high-quality best practices, innovations and scientific
                    evidence in PHC.
                  </p>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card height="330" class="mb-5">
                <h3>Our Values</h3>

                <v-card-text>
                  <p>• Integrity and Loyalty</p>
                  <p>• Accountability and Transparency</p>
                  <p>• Unity and Team spirit</p>
                  <p>• Timely and Quality services</p>
                  <p>• Confidentiality and Professionalism</p>
                  <p>• Accessibility and Responsiveness</p>
                  <p>• Openness</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
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
