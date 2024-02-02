<!-- src/components/HorizontalImageCards.vue -->

<template>
  <div>
    <span class="pt-12 pb-12 color-title">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold text-5 basil--text">Sponsors</h1>
      </v-card-title>
      <hr class="centered-line" />
    </span>

    <v-row justify="center" align="center">
      <v-col
        v-for="image in images"
        :key="image.id"
        cols="2"
        sm="2"
        md="2"
        lg="2"
      >
        <a :href="image.href" target="_blank" rel="noopener noreferrer">
          <v-card class="image-card" flat elevation="">
            <v-img
              :src="image.src"
              alt="Image"
              width="75%"
              height="750%"
              :aspect-ratio="1"
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
        { id: 2, src: "africa.png", href: "https://africacdc.org/" },
        { id: 2, src: "ths.png", href: "https://ths.or.tz/" },
        {
          id: 4,
          src: "pepfar.png",
          href: "https://www.hiv.gov/federal-response/pepfar-global-aids/pepfar/",
        },
        { id: 3, src: "who.png", href: "https://www.who.int/" },
        { id: 4, src: "usaid.png", href: "https://www.usaid.gov/" },
        { id: 2, src: "aaph.jpeg", href: "https://www.aaph.or.tz/" },
      ],
    };
  },
};
</script>

<style scoped>
.contain {
  object-fit: contain !important;
}

.image-card {
  margin: 8px;
  width: 450px;
}
.bdt2 {
  border-top: solid 2px #0c95eb77;
}
.bdw {
  border-bottom: solid 2px #0c95eb77;
}
.color-title {
  color: grey;
}
</style>
<style scoped>
.color-title {
  color: grey;
}

.centered-line {
  width: 10%;
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
