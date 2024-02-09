<template>
  <div>
    <span class="pt-12 pb-12 color-title">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold text-5 basil--text">Videos</h1>
      </v-card-title>
      <!-- <hr class="centered-line" /> -->
    </span>
    <v-row class="video-row" justify="center">
      <v-col v-for="(video, index) in videos" :key="video.id">
        <v-card width="100%" elevation="0" class="center-video">
          <div class="center-video" v-html="getEmbedCode(video.id)"></div>
        </v-card>
        <span class="grey--text">
          {{ video.caption }}
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [
        {
          id: "video1.mp4",
          caption: "Primary Health Care",
        },
        {
          id: "video2.mp4",
          caption: "Primary Health Care",
        },
        // Add more video IDs as needed
      ],
    };
  },
  methods: {
    getEmbedCode(videoId) {
      return `
          <video controls width="640" height="330">
            <source src="${require(`@/assets/${videoId}`)}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
    },
  },
};
</script>

<style scoped>
/* Helper classes */
.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
</style>
