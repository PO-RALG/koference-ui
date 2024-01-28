<!-- src/components/HorizontalImageCards.vue -->

<template>
  <div>
    <span class="pt-12 pb-12 color-title">
      <h1>Sponsors</h1>
      <hr class="centered-line" />
    </span>

    <v-row>
      <v-col
        v-for="image in images"
        :key="image.id"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <v-card class="image-card" elevation="0">
          <v-img :src="image.src" alt="Image" aspect-ratio="2.5"></v-img>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { id: 1, src: "download.jpeg" },
        { id: 2, src: "download2.png" },
        { id: 3, src: "download3.jpg" },
        { id: 4, src: "download.jpeg" },
        { id: 5, src: "download2.png" },
        { id: 6, src: "download3.jpg" }, // Add more images as needed
      ],
    };
  },
};
</script>

<style scoped>
.image-card {
  margin: 8px;
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
</style>
