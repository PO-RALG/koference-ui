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
          <div class="caption2">
            <span v-html="item.tag"></span>

            <!-- <span class="yellow--text"> VENUE : JAKAYA KIKWETE </span> -->
          </div>
        </v-row>
        <!-- <v-row
          align="end"
          justify="center"
          class="caption-container caption-sub d-none d-md-flex"
        >
          <div class="caption2">
            {{
              "THE FIRST INTERNATIONAL PRIMARY HEALTH CARE CONFERENCE IN DODOMA TANZANIA 2014:"
            }}
            <span class="yellow--text"> VENUE : JAKAYA KIKWETE </span>
          </div>
        </v-row> -->
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
          src: "mtoto.jpg",
          tag: "THE FIRST INTERNATIONAL PRIMARY HEALTH CARE CONFERENCE IN DODOMA TANZANIA 2014 <span class='yellow--text'> VENUE : JAKAYA KIKWETE </span>",
        },
        {
          src: "12.jpeg",
          // tag: "THE FIRST INTERNATIONAL PRIMARY HEALTH CARE CONFERENCE IN DODOMA TANZANIA 2014",
        },
        {
          src: "8.jpeg",
          // tag: "THE FIRST INTERNATIONAL PRIMARY HEALTH CARE CONFERENCE IN DODOMA TANZANIA 2014",
        },

        {
          src: "10.jpeg",
          // tag: "THE FIRST INTERNATIONAL PRIMARY HEALTH CARE CONFERENCE IN DODOMA TANZANIA 2014",
        },
        {
          src: "11.jpeg",
          // tag: "THE FIRST INTERNATIONAL PRIMARY HEALTH CARE CONFERENCE IN DODOMA TANZANIA 2014",
        },

        // {
        //   src: "mama.jpg",
        //   tag: "THE FIRST INTERNATIONAL PRIMARY HEALTH CARE CONFERENCE IN DODOMA TANZANIA 2014",
        // },
      ],
    };
  },
};
</script>
<style>
.soften-image {
  filter: fade(5px); /* Adjust the blur value as needed */
}
.caption-container {
  position: absolute;
  bottom: 100px; /* Adjust as needed to control the distance from the bottom */
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgba(91, 89, 89, 0.125);
}

.caption-container .caption {
  font-size: 35px !important; /* Add !important to ensure it takes precedence */
  color: white; /* Adjust the color if needed */
  font-weight: bold; /* Make the caption bold */
  line-height: 1.2; /* Adjust the line-height value as needed */
}
.caption-container .caption2 {
  font-size: 50px !important; /* Add !important to ensure it takes precedence */
  color: white; /* Adjust the color if needed */
  font-weight: bold; /* Make the caption bold */
}
.caption-container {
  padding-bottom: 30px; /* Adjust the padding as needed */
}
.caption-sub {
  padding-bottom: 10px; /* Adjust the padding as needed */
}

.fade-transition {
  transition: opacity 0.5s ease-in-out;
}
</style>
