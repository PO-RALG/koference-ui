<template>
  <!-- About page content -->
  <div class="bg-image">
    <!-- <hr class="centered-line2" /> -->
    <div class="row align-start justify-center pl-5">
      <div class="col-lg-5 col-12">
        <div class="row">
          <!-- <div class="text-right col-xl-3 col-4 d-none d-md-flex">
            <img
              alt="Elfin Force"
              loading="lazy"
              src="/main.png"
              width="50"
              height="70"
            />
          </div> -->
          <div class="text-left col-xl-8 col-9 offset-1">
            <div class="row">
              <!-- <div class="col d-md-none"> -->
              <div class="col">
                <h2 class="text-h4 text-uppercase font-weight-bold basil--text">
                  Main Theme
                </h2>
              </div>
            </div>
            <div class="row align-center justify-center">
              <div class="text-body-1 col col-12">
                <div class="text-h7">
                  Primary Health Care <span class="white--text">(PHC)</span> as
                  a vehicle for the journey to achieve Universal Health Coverage
                  <span class="white--text">(UHC)</span> in Tanzania
                </div>
                <div class="py-3">
                  <v-img
                    src="/bango.jpeg"
                    alt="Business Card Footer Image"
                    max-width="60%"
                  ></v-img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 offset-lg-0 col-12">
        <div class="row">
          <div class="text-left col-xl-1 col-4 d-none d-md-flex">
            <img
              alt="Elfin Force"
              loading="lazy"
              src="/sub _theme.jpg"
              width="149"
              height="541"
              class="pt-8"
            />
          </div>
          <div class="text-left col-xl-8 col-7 offset-1">
            <div class="row">
              <div class="col d-md-none">
                <h2 class="text-h4 text-uppercase font-weight-bold basil--text">
                  Sub Themes
                </h2>
              </div>
              <div class="col"></div>
            </div>
            <div class="row">
              <div class="text-h7 man-text-block col col-12">
                <div class="">
                  <ul>
                    <li>
                      Social determinants, Social Behavioral Change and
                      Communication <span class="white--text">(SBCC)</span> and
                      Community Health System.
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
                      Reproductive, maternal, newborn, child and adolescent
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
                    <li>Community engagement.</li>
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
                <!-- <div class="py-3"></div> -->
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
.bg-image {
  background-image: url("./slider1.jpg");
  /* background-image: url("path_to_your_image.jpg"); */
  background-size: cover;
  background-position: center;
}
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
  color: #d9e5e2 !important;
}
</style>
<style scoped>
/* Use the specified font */
.v-heading {
  font-family: "Your-Font-Here", sans-serif;
}
</style>
