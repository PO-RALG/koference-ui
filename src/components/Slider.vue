<!-- style="background-color: rgba(0, 0, 0, 0.6)" -->
<template>
  <section class="landing-candidates pt-12">
    <div class="row no-gutters">
      <div
        aria-label="Elfin Force"
        role="img"
        class="v-image v-responsive theme--dark"
        style="min-height: calc(100vh - 64px)"
      >
        <div class="v-responsive__sizer" style="padding-bottom: 51.2674%"></div>

        <v-carousel
          progress
          light
          interval="12000"
          height="100%"
          :cycle="true"
          :hide-delimiter-background="true"
          :transition="fadeTransition"
        >
          <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src"
            ><div class="v-image__image v-image__image--cover">
              <div class="v-responsive__content" style="width: 1578px">
                <div class="container fill-height">
                  <div class="row mx-auto">
                    <div class="white--text col-lg-10 col-12 pt-12">
                      <div
                        class="v-card v-sheet theme--dark rounded-0"
                        style="background-color: rgba(0, 0, 0, 0.5)"
                      >
                        <div class="container py-0">
                          <div class="row no-gutters">
                            <div class="offset-lg-1 col col-11 offset-1">
                              <h1
                                class="font-weight-black text-shadow text-h4 text-sm-h2 text-lg-h1"
                              >
                                <span class="green--text"
                                  >1st International Primary Health Care
                                  Conference in Tanzania Date:
                                  25-27/03/2024</span
                                ><br />
                              </h1>
                            </div>
                          </div>
                          <div class="row no-gutters">
                            <div class="offset-lg-1 col col-10 offset-1">
                              <div
                                class="container text-shadow text-body-1 cols"
                              >
                                <strong>Guest of Honor:</strong>
                                <span class="green--text">
                                  H.E. Dr. Samia Suluhu Hassan, The President of
                                  the United Republic of Tanzania.
                                </span>
                                <br />
                                <strong> Venue: </strong>
                                <span class="green--text">
                                  Jakaya Mrisho Kikwete Convention Centre,
                                  Dodoma City Council.
                                </span>
                                <br />
                                <strong> Main Theme:</strong>
                                <span class="green--text">
                                  Primary Health Care (PHC) as a vehicle for the
                                  journey to achieve Universal Health Coverage
                                  (UHC) in Tanzania.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row no-gutters">
                          <div class="text-right col">
                            <v-btn
                              @click="goHome"
                              class="pa-6 text-transform-none font-weight-bold v-btn v-btn--is-elevated v-btn--has-bg v-btn--router v-btn--tile theme--dark v-size--default success"
                              ><span class="v-btn__content">
                                Register Now
                                <i
                                  aria-hidden="true"
                                  class="v-icon notranslate mdi mdi-arrow-up-thin theme--dark"
                                ></i></span
                            ></v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div></div
          ></v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          src: "slidera.jpg",
        },

        {
          src: "president.jpg",
        },
      ],
      fadeTransition: "fade-transition",
    };
  },
  methods: {
    goHome() {
      // Use the Vue Router to navigate to the home route
      this.$router.push({ path: "/registration-page" });
    },
  },
};
</script>
<style scoped>
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 0.5s;
}
.fade-transition-enter,
.fade-transition-leave-to {
  opacity: 0;
}
.centered-line {
  width: 100%;
  border: 3px #356859; /* Adjust thickness as needed */
  margin: 8px auto; /* Adjust as needed */
}
.soften-image {
  filter: fade(5px); /* Adjust the blur value as needed */
}
.caption-container {
  position: absolute;
  bottom: 100px; /* Adjust as needed to control the distance from the bottom */
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgba(91, 89, 89, 0.125);
}

.caption-container .caption {
  font-size: 35px !important; /* Add !important to ensure it takes precedence */
  color: white; /* Adjust the color if needed */
  font-weight: bold; /* Make the caption bold */
  line-height: 1.2; /* Adjust the line-height value as needed */
}
.caption-container .caption2 {
  font-size: 50px !important; /* Add !important to ensure it takes precedence */
  color: white; /* Adjust the color if needed */
  font-weight: bold; /* Make the caption bold */
}
.caption-container {
  padding-bottom: 300px; /* Adjust the padding as needed */
}
.caption-sub {
  padding-bottom: 10px; /* Adjust the padding as needed */
}

.fade-transition {
  transition: opacity 0.5s ease-in-out;
}
</style>
<style scoped>
.overlay {
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.073));
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
