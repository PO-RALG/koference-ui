<template>
  <v-footer class="bg-kala">
    <br />
    <v-container class="pt-1">
      <v-layout class="text-left white--text font-weight-light mx-auto">
        <!-- <v-divider color="white" class="mb-5"></v-divider> -->
      </v-layout>
      <span color="#052f69">
        <v-row>
          <v-col>
            <p class="text-center white--text">
              <v-layout class="text-left white--text font-weight-light mx-auto">
                <span>
                  <div
                    class="text-shadow text-body-4 cols d-none d-md-flex headline"
                  >
                    Contact Us.
                  </div>
                  <div class="caption white--text font-weight-bold pt-5">
                    <p class="text-center">
                      <v-img
                        class="pl-12"
                        src="/coat_of_arms.svg.png"
                        width="20px"
                        height="50px"
                      ></v-img>
                    </p>
                    <v-icon color="white" span>mdi-office-building</v-icon>
                    <span
                      >Permanent Secretary, President's Office, Regional
                      Administration and Local Government</span
                    >
                    <br />
                    <v-icon color="white" span>mdi-map-marker</v-icon>
                    <span> P.O Bx: 1923 Dodoma - Tanzania </span>,
                    <br />

                    <v-icon color="white" span>mdi-phone</v-icon>
                    <strong> <span>Phone: +255 262 321 234 </span> </strong>,
                    <br />

                    <v-icon color="white" span>mdi-email</v-icon>
                    <strong> <span>Email: ps@tamisemi.go.tz </span> </strong>,
                    <br />

                    <v-icon color="white" span>mdi-web-box</v-icon>
                    <strong>
                      <span>tamisemi.go.tz</span>
                    </strong>
                  </div>
                </span>
              </v-layout>

              <!-- ///mmmmmm -->

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
                      <v-icon x-large color="white">mdi-facebook</v-icon>
                    </a>
                  </v-btn>

                  <v-btn icon>
                    <a
                      href="https://twitter.com/or_tamisemi?lang=en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <v-icon x-large color="white">mdi-twitter</v-icon>
                    </a>
                  </v-btn>

                  <v-btn icon>
                    <a
                      href="https://www.instagram.com/ortamisemi/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <v-icon x-large color="white">mdi-instagram</v-icon>
                    </a>
                  </v-btn>
                </v-col>
              </v-row>
              &copy; {{ new Date().getFullYear() }}
              <span class="">
                {{ "TAMISEMI" }}
              </span>
              <span class="">
                {{ ". All right reserved." }}
              </span>
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
