<template>
  <!-- About page content -->
  <div>
    <!-- <hr class="centered-line2" /> -->
    <div class="row align-start justify-center">
      <div class="col-lg-5 col-12">
        <div class="row">
          <div class="text-right col-xl-3 col-4">
            <img
              alt="Elfin Force"
              loading="lazy"
              src="/man-enterprise.svg"
              width="150"
              height="351"
            />
          </div>
          <div class="text-left col-xl-8 col-7 offset-1">
            <div class="row">
              <div class="col">
                <h2 class="text-h4 text-uppercase font-weight-bold basil--text">
                  Main Theme
                </h2>
              </div>
            </div>
            <div class="row">
              <div class="text-body-1 man-text-block col col-9">
                <div class="container">
                  Primary Health Care <span class="green--text">(PHC)</span> as
                  a vehicle for the journey to achieve Universal Health Coverage
                  <span class="green--text">(UHC)</span> in Tanzania
                </div>
                <div class="py-3"></div>
                <!-- <a
                  href="/register/company"
                  class="white--text text-transform-none pa-6 v-btn v-btn--is-elevated v-btn--has-bg v-btn--router v-btn--tile theme--dark v-size--default success"
                  ><span class="v-btn__content">
                    I want to recruit
                    <i
                      aria-hidden="true"
                      class="v-icon notranslate mdi mdi-arrow-right-thin theme--dark"
                    ></i></span
                ></a> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-5 offset-lg-1 col-12">
        <div class="row">
          <div class="text-right col-xl-3 col-4">
            <img
              alt="Elfin Force"
              loading="lazy"
              src="/man-talent.svg"
              width="123"
              height="351"
            />
          </div>
          <div class="text-left col-xl-8 col-7 offset-1">
            <div class="row">
              <div class="col">
                <h2 class="text-h4 text-uppercase font-weight-bold basil--text">
                  Sub Themes
                </h2>
              </div>
            </div>
            <div class="row">
              <div class="text-body-1 man-text-block col col-9">
                <div class="container">
                  <ul>
                    <li>
                      Social determinants, Social Behavioral Change and
                      Communication (SBCC) and Community Health System.
                    </li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Health Care Financing.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Data use, Innovation, Technology and Research.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Health Workforce.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Leadership and Governance.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Health Commodities.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>
                      Reproductive, maternal, new borne, adolescent and child
                      health.
                    </li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Emerging and re-emerging diseases.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Communicable diseases.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Non-Communicable diseases.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Neglected Tropical diseases.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Data use, Innovation, Technology and Research.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Communities engagement.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Nutrition services.</li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>
                      Social Welfare Services (Gender Based Violence, Violence
                      Against Children, Social protection, Aging population).
                    </li>
                  </ul>
                </div>
                <div class="container">
                  <ul>
                    <li>Service delivery.</li>
                  </ul>
                </div>
                <div class="py-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

/* ul {
  list-style-type: circle;
  padding: 0;
}

li {
  display: flex;
  align-items: start;
  margin-bottom: 8px;
} */

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
