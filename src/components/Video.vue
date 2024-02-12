<template>
  <div>
    <span class="pt-12 pb-12 color-title">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold text-5 basil--text">Videos</h1>
      </v-card-title>
    </span>
    <v-row class="video-row" justify="center">
      <v-col v-for="(video, index) in videos" :key="video.id">
        <v-card width="100%" elevation="0" class="center-video">
          <div class="video-container">
            <div class="center-video" v-html="getEmbedCode(video.id)"></div>
            <span class="caption">
              {{ video.caption }}
            </span>
          </div>
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
        {
          id: "/afya1.mp4",
          caption: "Primary Health Care",
        },
        {
          id: "/afya.mp4",
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
          <source src="${videoId}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    },
  },
};
</script>
<style scoped>
/* Center video and caption horizontally */
.video-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Style for the caption */
.caption {
  margin-top: 10px; /* Adjust as needed */
  font-size: 14px; /* Adjust as needed */
}

/* Helper classes */
.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
</style>
