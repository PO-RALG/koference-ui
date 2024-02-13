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
          <!-- {{ video.caption }} -->
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
          id: "ZrRS7TxlJwc",
          caption: "Primary Health Care",
        },
        {
          id: "_fPohVz6fBA",
          caption: "Primary Health Care",
        },
        // Add more video IDs as needed
      ],
    };
  },
  methods: {
    getEmbedCode(videoId) {
      return `
            <iframe
              id="youtube-player-${videoId}"
              width="500"
              height="330"
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
/* Helper classes */
.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
</style>
<style scoped>
.bg-kala {
  background-color: rgb(242, 242, 242);
}
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

.center-video {
  width: 100%; /* Ensures the video container fills the card width */
  height: 100%; /* Ensures the video container fills the card height */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
