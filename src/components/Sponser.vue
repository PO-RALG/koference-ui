<template>
  <div>
    <span class="pt-12 pb-12 color-title">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold text-5 basil--text">Sponsors</h1>
      </v-card-title>
      <!-- <hr class="centered-line" /> -->
    </span>
    <v-row justify="center" align="center">
      <v-col
        v-for="image in images"
        :key="image.id"
        cols="12"
        sm="6"
        md="4"
        lg="2"
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
              width="40%"
              height="60%"
              :aspect-ratio="1.4"
            ></v-img>
          </v-card>
        </a>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { id: 1, src: "unicef.png", href: "https://www.unicef.org/ " },
        { id: 5, src: "afya.jpeg", href: "https://www.unicef.org/ " },
        { id: 2, src: "africa.png", href: "https://africacdc.org/" },
        { id: 6, src: "ths.png", href: "https://ths.or.tz/" },
        {
          id: 8,
          src: "pepfar.png",
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
</style>
