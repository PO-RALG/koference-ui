<template>
  <div>
    <hr class="centered-line2" />

    <span class="pt-12 pb-12 color-title">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold text-5 basil--text">Sponsors</h1>
      </v-card-title>
    </span>
    <div class="elementor-shape elementor-shape-top" data-negative="true">
      <v-row justify="center" align="center">
        <v-col
          v-for="image in images"
          :key="image.id"
          cols="12"
          sm="6"
          md="4"
          lg="1"
        >
          <a :href="image.href" target="_blank" rel="noopener noreferrer">
            <v-card
              justify="center"
              align="center"
              class="image-card"
              flat
              elevation=""
            >
              <v-img
                :src="image.src"
                alt="Image"
                width="70%"
                height="70%"
                :aspect-ratio="1"
              ></v-img>
            </v-card>
          </a>
        </v-col>
      </v-row>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        <path
          class="elementor-shape-fill"
          d="M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z"
          style="fill: #053973"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { id: 1, src: "unicef.png", href: "https://www.unicef.org/ " },
        // { id: 5, src: "afya.jpeg", href: "https://www.unicef.org/ " },
        { id: 2, src: "cds.jpeg", href: "https://africacdc.org/" },
        { id: 6, src: "ths.png", href: "https://ths.or.tz/" },
        {
          id: 8,
          src: "pepfa.jpg",
          href: "https://www.hiv.gov/federal-response/pepfar-global-aids/pepfar/",
        },
        { id: 3, src: "who.png", href: "https://www.who.int/" },
        { id: 4, src: "usaid.png", href: "https://www.usaid.gov/" },
        { id: 7, src: "aaph.jpeg", href: "https://www.aaph.or.tz/" },
      ],
    };
  },
};
</script>

<style>
/* Add any additional styles for image-card here */
.image-card {
  /* Add any specific styles for the cards */
  margin: 10px; /* Example margin for spacing between cards */
}
.centered-line2 {
  width: 90%;
  border: 3px solid rgb(26, 86, 182); /* Adjust thickness as needed */
  margin: 8px auto; /* Adjust as needed */
}
</style>
