<template>
  <v-footer class="bg-kala">
    <v-sheet class="bg-kala">
      <v-container>
        <v-row>
          <v-col>
            <p class="text-center">
              <v-img
                class="pl-12"
                src="/coat_of_arms.svg.png"
                width="20px"
                height="50px"
              ></v-img>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet class="bg-kala">
      <v-container>
        <v-row>
          <v-col>
            <p class="text-center"></p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet class="bg-kala">
      <v-container>
        <v-row>
          <v-col>
            <p class="text-center"></p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-spacer></v-spacer>

    <v-layout class="text-left white--text font-weight-light mx-auto">
      <small>
        <div
          class="container text-shadow text-body-1 cols d-none d-md-flex headline"
        >
          Contact Us.
        </div>
        <div class="caption white--text font-weight-bold pt-5">
          <v-icon color="white" small>mdi-office-building</v-icon>
          <small
            >Katibu Mkuu, Ofisi ya Rais Tawala za Mikoa na Serikali za
            Mitaa</small
          >
          <br />
          <v-icon color="white" small>mdi-map-marker</v-icon>
          <small> S.L.P: 1923 Dodoma - Tanzania </small>,
          <br />

          <v-icon color="white" small>mdi-phone</v-icon>
          <strong> <small>Simu: +255 262 321 234 </small> </strong>,
          <br />

          <v-icon color="white" small>mdi-email</v-icon>
          <strong> <small>Barua Pepe: ps@tamisemi.go.tz </small> </strong>,
          <br />

          <v-icon color="white" small>mdi-web-box</v-icon>
          <strong>
            <small>tamisemi.go.tz</small>
          </strong>
        </div>
      </small>
    </v-layout>

    <v-sheet color="grey" dark class="d-none d-md-flex">
      <v-row>
        <v-col cols="6">
          <v-img src="/assets/afya.jpeg" height="50"></v-img>
        </v-col>
        <v-col cols="6" class="text-right">
          <!-- Social media icons with links -->
          <v-btn icon>
            <a
              href="https://www.facebook.com/TAMISEMI/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon color="white">mdi-facebook</v-icon>
            </a>
          </v-btn>

          <v-btn icon>
            <a
              href="https://twitter.com/or_tamisemi?lang=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon color="white">mdi-twitter</v-icon>
            </a>
          </v-btn>

          <v-btn icon>
            <a
              href="https://www.instagram.com/ortamisemi/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon color="white">mdi-instagram</v-icon>
            </a>
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>

    <br />
    <v-container class="bg-kala pt-10">
      <v-layout class="text-left white--text font-weight-light mx-auto">
        <v-divider color="white" class="mb-5"></v-divider>
      </v-layout>
      <span color="#052f69">
        <v-row>
          <v-col>
            <p class="text-center white--text">
              &copy; {{ new Date().getFullYear() }}
              <small class="">
                {{ "TAMISEMI" }}
              </small>
              <small class="">
                {{ ". All right reserved." }}
              </small>
            </p>
          </v-col>
        </v-row>
      </span>
    </v-container>
  </v-footer>
</template>

<style scoped>
.bg-kala {
  background-color: #052f69;
}
</style>
