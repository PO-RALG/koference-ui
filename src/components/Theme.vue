<template>
  <!-- About page content -->
  <div>
    <h1 class="text-center font-weight-bold text-5 basil--text">
      Conference Themes
    </h1>
    <!-- <hr class="centered-line" /> -->
    <v-container class="mt-5">
      <v-row>
        <v-col cols="12">
          <!-- <v-divider class="mb-5"></v-divider> -->

          <!-- Sample about content -->
          <v-row>
            <v-row justify="start">
              <v-col cols="12" md="12">
                <v-card color="" flat height="100%" class="mb-5">
                  <v-container>
                    <v-row justify="start">
                      <v-col cols="12" sm="10" md="8">
                        <div
                          class="container text-shadow text-body-1 cols d-none d-md-flex headline"
                        >
                          Conference Main Theme.
                        </div>

                        <div
                          class="container text-shadow text-body-1 cols d-flex flex-column align-center d-md-none headline"
                        >
                          Conference Main Theme.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          Primary Health Care (PHC) as a vehicle for the journey
                          to achieve Universal Health Coverage (UHC) in Tanzania
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-container>
                    <v-row justify="start">
                      <v-col cols="12" sm="10" md="8">
                        <div
                          class="container text-shadow text-body-1 cols d-none d-md-flex headline"
                        >
                          Conference Sub-themes.
                        </div>

                        <div
                          class="container text-shadow text-body-1 cols d-flex flex-column align-center d-md-none headline"
                        >
                          Conference Sub-themes.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          1. Social determinants, Social Behavioral Change and
                          Communication (SBCC) and Community Health System.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          2. Health Care Financing.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          3. Data use, Innovation, Technology and Research.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          4. Health Workforce.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          5. Leadership and Governance.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          6. Health Commodities.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          7. Reproductive, maternal, new borne, adolescent and
                          child health.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          8. Emerging and re-emerging diseases.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          9. Communicable diseases.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          10. Non-Communicable diseases.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          11. Neglected Tropical diseases.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          12. Oral Health.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          12. Eye care.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          13. Mental health and substance abuse.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          13. Nutrition services.
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          14. Social Welfare Services (Gender Based Violence,
                          Violence Against Children, Social protection, Aging
                          population).
                        </div>
                        <div class="container text-shadow text-body-1 cols">
                          15. Service delivery.
                        </div>
                        <v-row
                          class="d-flex flex-column align-center d-md-none"
                        >
                        </v-row>
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
  align-items: start;
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
<style scoped>
/* Use the specified font */
.v-heading {
  font-family: "Your-Font-Here", sans-serif;
}
</style>
