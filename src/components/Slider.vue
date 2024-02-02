<template>
  <v-container class="mt-10" style="margin-top: 10px">
    <v-carousel hide-delimiters style="max-height: 600px">
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        :src="item.src"
        reverse-transition="fade"
        transition="fade"
        class="soften-image"
      >
        <v-row align="end" justify="center" class="caption-container">
          <div class="caption">{{ item.tag }}</div>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          src: "3b.png",
          tag: "",
        },
        {
          src: "0102.jpeg",
          tag: "The First International Primary Health Care Conference in DODOMA Tanzania 2014",
        },
      ],
    };
  },
};
</script>
<style>
.soften-image {
  filter: blur(0px); /* Adjust the blur value as needed */
}
.caption-container {
  position: absolute;
  bottom: 100px; /* Adjust as needed to control the distance from the bottom */
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgba(91, 89, 89, 0.125); /* Adjust the color if needed */
}

.caption-container .caption {
  font-size: 24px !important; /* Add !important to ensure it takes precedence */
  color: white; /* Adjust the color if needed */
  font-weight: bold; /* Make the caption bold */
}
.caption-container {
  padding-bottom: 20px; /* Adjust the padding as needed */
}

.fade-transition {
  transition: opacity 0.5s ease-in-out;
}
</style>
