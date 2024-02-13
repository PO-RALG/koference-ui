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
            <div
              class="center-video"
              v-html="getEmbedCode(video.id, video.thumbnail)"
              ref="videoElement"
            ></div>
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
import Vue from "vue";

export default {
  data() {
    return {
      videos: [
        {
          id: "/afya1.mp4",
          caption: "Primary Health Care",
          thumbnail: "aa.png", // Add thumbnail URL for each video
        },
        {
          id: "/afya3.mp4",
          caption: "Primary Health Care",
          thumbnail: "/c.png", // Add thumbnail URL for each video
        },
        {
          id: "/afya.mp4",
          caption: "Primary Health Care",
          thumbnail: "a.png", // Add thumbnail URL for each video
        },
        // Add more videos as needed
      ],
    };
  },
  mounted() {
    Vue.nextTick(() => {
      this.attachPlayListeners();
    });
  },
  methods: {
    getEmbedCode(videoId, thumbnailUrl) {
      return `
        <div class="video-container">
          <img class="thumbnail-image" src="${thumbnailUrl}" alt="Video Thumbnail" width="500" height="330">
          <v-col>
            <video controls width="400" height="250">
            <source src="${videoId}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
            </v-col>
        </div>
        <style>
          .video-container {
            position: relative;
          }

          .thumbnail-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        </style>
      `;
    },
    attachPlayListeners() {
      const videoElements = this.$refs.videoElement;
      if (videoElements) {
        if (!Array.isArray(videoElements)) {
          videoElements = [videoElements];
        }
        videoElements.forEach((videoElement) => {
          videoElement
            .querySelector("video")
            .addEventListener("play", this.hideThumbnail);
        });
        videoElements.forEach((videoElement) => {
          videoElement
            .querySelector("video")
            .addEventListener("ended", this.showThumbnail);
        });
      }
    },
    hideThumbnail(event) {
      event.target.previousElementSibling.style.display = "none";
    },
    showThumbnail(event) {
      event.target.previousElementSibling.style.display = "block";
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
