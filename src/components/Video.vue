<template>
  <div>
    <span class="pt-12 pb-12 color-title">
      <h1>Videos</h1>
      <hr class="centered-line" />
    </span>
    <v-row class="video-row" justify="center">
      <v-col v-for="(video, index) in videos" :key="video.id">
        <v-card width="440" elevation="5" class="video-card center-video">
          <div class="center-video" v-html="getEmbedCode(video.id)"></div>
        </v-card>
        <p class="video-caption pt-2 pb-3">
          <span class="primary--text">
            {{ video.caption }}
          </span>
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [
        { id: "3nmGqcSEYVw", caption: "Caption for video 1" },
        { id: "bIbEq2LQrAQ", caption: "Caption for video 2" },
        { id: "4oOonZWxjAs", caption: "Caption for video 3" },

        // Add more video IDs as needed
      ],
    };
  },
  methods: {
    getEmbedCode(videoId) {
      return `
          <iframe
            id="youtube-player-${videoId}"
            width="440"
            height="200"
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
.bdt {
  border-top: solid 5px #0867a6;
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

<style>
.video-card {
  max-width: 200px;
}

.center-video {
  max-width: 100%; /* Ensures the video container does not exceed the card width */
  margin: auto; /* Center the video horizontally within the card */
}
</style>
<style>
.video-row {
  width: 100%;
}

.video-col {
  /* margin: 1px; */
}

.video-card {
  width: 700px;
}

.center-video {
  width: 100%; /* Ensures the video container fills the card width */
  height: 100%; /* Ensures the video container fills the card height */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
