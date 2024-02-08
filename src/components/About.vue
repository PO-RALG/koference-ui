<template>
  <!-- About page content -->
  <div>
    <v-container class="mt-10">
      <v-row>
        <v-col cols="12">
          <h1 class="text-center mb-5 color-title">About Conference Portal</h1>
          <hr class="centered-line" />
          <v-divider class="mb-5"></v-divider>

          <!-- Sample about content -->
          <v-row>
            <v-row justify="center">
              <v-col cols="12" md="12">
                <v-card color="#f3f5f5" flat height="100%" class="mb-5">
                  <v-container>
                    <v-row justify="center">
                      <v-col cols="12" sm="10" md="8">
                        <v-card-title class="headline"
                          >Our Mission</v-card-title
                        >
                        <v-card-text>
                          <ul>
                            <h2>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                To be an exemplary international conference in
                                sharing high-quality best practices, innovations
                                and scientific evidence in PHC
                              </li>
                            </h2>
                          </ul>
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>

              <v-col cols="12" md="12">
                <v-card color="#f3f5f5" flat height="100%" class="mb-5">
                  <v-container>
                    <v-row justify="center">
                      <v-col cols="12" sm="10" md="8">
                        <v-card-title class="headline">Our Vision</v-card-title>
                        <v-card-text>
                          <ul>
                            <h2>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                To provide scientific proven evidence,
                                innovations and best practices to support
                                evidence-based decision making to policy makers
                                and implementers using available
                                multidisciplinary local and international
                                experts in PHC
                              </li>
                            </h2>
                          </ul>
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>

              <v-col cols="12" md="12">
                <v-card color="#f3f5f5" flat height="100%" class="mb-5">
                  <v-container>
                    <v-row justify="center">
                      <v-col cols="12" sm="10" md="8">
                        <v-card-title class="headline">Our Values</v-card-title>
                        <v-card-text>
                          <ul>
                            <h2>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                Integrity and Loyalty
                              </li>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                Accountability and Transparency
                              </li>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                Unity and Team spirit
                              </li>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                Timely and Quality services
                              </li>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                Confidentiality and Professionalism
                              </li>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                Accessibility and Responsiveness
                              </li>
                              <li>
                                <v-icon color="primary">mdi-check</v-icon>
                                Openness
                              </li>
                            </h2>
                          </ul>
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";

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
  created() {
    Vue.nextTick(() => {
      // This will be executed after the DOM has been updated
      window.scrollTo(0, 0); // Scroll to the top
    });
  },
};
</script>
<style scoped>
.mission-card {
  /* Add any additional styling for the card */
  padding: 20px;
}

.headline {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

v-icon {
  margin-right: 8px;
}
</style>
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

.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
</style>
