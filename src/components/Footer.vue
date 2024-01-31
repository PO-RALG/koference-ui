<template>
  <v-footer class="bg-kala">
    <!-- Adjust the background color and text color -->
    <v-sheet color="primary" class="d-none d-md-flex">
      <v-container>
        <v-row>
          <v-col>
            <!-- <v-img src="/assets/logo.png" height="50"></v-img> -->
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- Footer content -->

    <v-sheet>
      <v-container>
        <v-row>
          <v-col>
            <p class="text-center">
              &copy; {{ new Date().getFullYear() }}
              <small class="">
                {{ "TAMISEMI" }}
              </small>
              <small class="">
                {{ ". All right reserved." }}
              </small>
              <small class="">
                <strong>{{ " Conference Portal v1.0 ." }}</strong>
              </small>
              <small class="">
                {{
                  "For any Technical inquiry, please contact your ICT Support Team"
                }} </small
              >.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-spacer></v-spacer>
    <v-sheet color="primary" dark class="d-none d-md-flex">
      <v-row>
        <v-col cols="6">
          <!-- <v-img src="/assets/logo.png" height="50"></v-img> -->
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
  </v-footer>
</template>

<style scoped>
.bg-kala {
  background-color: rgb(242, 242, 242);
}
</style>
