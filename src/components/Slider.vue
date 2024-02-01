<template>
  <v-container class="mt-10" style="margin-top: 10px">
    <v-carousel hide-delimiters>
      <v-carousel-item>
        <v-img
          src="3.png"
          class="full-width full-height fade-transition"
        ></v-img>
        <v-row align="end" justify="center" class="caption-container">
          <v-col>
            <!-- <div class="caption">Caption for Slide 2</div> -->
          </v-col>
        </v-row>
      </v-carousel-item>
      <v-carousel-item>
        <v-img
          src="0102.jpeg"
          class="full-width full-height fade-transition"
        ></v-img>
        <v-row align="end" justify="center" class="caption-container">
          <v-col>
            <div class="caption">
              The first International Primary Health Care Conference in DODOMA
              Tanzania - 2024
            </div>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>
<style>
.caption-container {
  position: absolute;
  bottom: 100px; /* Adjust as needed to control the distance from the bottom */
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgba(91, 89, 89, 0.125); /* Adjust the color if needed */
}

.caption-container .caption {
  font-size: 40px !important; /* Add !important to ensure it takes precedence */
  color: white; /* Adjust the color if needed */
  font-weight: bold; /* Make the caption bold */
}

.fade-transition {
  transition: opacity 0.5s ease-in-out;
}

.full-width {
  width: 100%;
}

.full-height {
  height: 100%;
  object-fit: cover;
}
</style>
