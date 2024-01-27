<template>
  <div>
    <span class="pt-12 pb-12 color-title">
      <h1>Videos</h1>
      <hr class="centered-line" />
    </span>
    <v-row>
      <v-col v-for="(video, index) in videos" :key="video.id" class="first-col">
        <v-card elevation="0">
          <div class="center-video" v-html="getEmbedCode(video.id)"></div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [
        { id: "dQw4w9WgXcQ" },
        { id: "VXskQcrNpfA" },
        // Add more video IDs as needed
      ],
    };
  },
  methods: {
    getEmbedCode(videoId) {
      return `
          <iframe
            id="youtube-player-${videoId}"
            width="640"
            height="360"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allowfullscreen
          ></iframe>
        `;
    },
  },
};
</script>

<style scoped>
.image-card {
  margin: 2px;
}

.color-title {
  color: grey;
}

.first-col {
  margin-right: 8px;
}

/* Center the video within the card */
.center-video {
  display: flex;
  align-items: center;
  justify-content: center;
}
.centered-line {
  width: 10%;
  border: 3px solid grey; /* Adjust thickness as needed */
  margin: 8px auto; /* Adjust as needed */
}
</style>
