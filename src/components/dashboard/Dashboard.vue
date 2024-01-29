<template>
  <v-card flat class="">
    <v-container>
      <v-card-actions class="pa-0">
        <h2>{{ "Profile Details" }}</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" large @click="openDialog">
          <v-icon>mdi-plus</v-icon>
          Payment Cofirmation
        </v-btn>
      </v-card-actions>
      <v-card max-width="100%" class="">
        <v-container>
          <v-row justify="start">
            <v-col cols="12" sm="8" md="6">
              <v-card color="grey" class="elevation-10 custom-card bdt2">
                <!-- Business Card Header -->
                <v-card-title class="text-h6 text-center mb-4">
                  <!-- Business Card -->
                </v-card-title>

                <!-- Business Card Content -->
                <v-card-text class="">
                  <!-- Company Logo -->
                  <v-img
                    :src="userx"
                    alt="User Photo"
                    max-width="10%"
                    height=""
                    class="align-start elevation-10"
                  ></v-img>
                  <v-card-actions class="pt-n8 pb-5 pr-5">
                    <h2 class="text-h5 white--text">
                      {{ user?.salutation }} {{ "." }} {{ user?.first_name }}
                      {{ " " }}{{ user?.last_name }}
                    </h2>
                    <v-spacer></v-spacer>
                    <h2 class="text-h5 grey--text">
                      {{ "ID" }}{{ " : " }} {{ user.user_identification }}
                    </h2>
                  </v-card-actions>

                  <!-- Company Information -->
                  <div class="text-start">
                    <p>
                      <span class="font-weight-bold grey--text">
                        <v-icon color="primary">mdi-office-building</v-icon>

                        {{ "Organization" }}{{ " : " }}
                      </span>
                      <span class="white--text">
                        {{ user?.organization }}
                      </span>
                    </p>
                    <p>
                      <span class="font-weight-bold grey--text">
                        <v-icon color="primary">mdi-map-marker-outline</v-icon>

                        {{ "Nationality" }}{{ " : " }}
                      </span>
                      <span class="white--text">
                        {{ user?.country.name }}
                      </span>
                    </p>
                    <p>
                      <span class="font-weight-bold grey--text">
                        <v-icon color="primary">mdi-phone</v-icon>
                        {{ "Phone" }}{{ " : " }}
                      </span>
                      <span class="white--text">
                        {{ user?.phone_number }}
                      </span>
                    </p>
                    <p>
                      <span class="font-weight-bold grey--text">
                        <v-icon color="primary">mdi-email</v-icon>
                        {{ "Email" }}{{ " : " }}
                      </span>
                      <span class="white--text">
                        {{ user?.email }}
                      </span>
                    </p>
                  </div>
                </v-card-text>

                <!-- Business Card Footer (Image) -->
                <v-card-actions class="justify-center">
                  <v-img
                    src="/business-card-footer-image.png"
                    alt="Business Card Footer Image"
                    max-width="100%"
                  ></v-img>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-list-item>
          <span
            >{{ "Payment Confirmation Date" }}{{ " : " }}
            {{ regInfromation?.createdAt | format() }}</span
          >
        </v-list-item>

        <v-list-item>
          <span
            >Payment Confirmation Status:
            {{
              getStatusText(
                this.user &&
                  this.user.jisajilis &&
                  this.user.jisajilis[0].status
                  ? true
                  : false
              )
            }}</span
          >
        </v-list-item>

        <v-divider class="my-3"></v-divider>

        <v-list>
          <v-list-item-group>
            <v-list-item v-if="regInfromation">
              <v-list-item-icon>
                <v-icon color="primary">mdi-attachment</v-icon>
              </v-list-item-icon>
              <a
                :href="getFullFilePath(regInfromation?.path_file)"
                target="_blank"
              >
                <span>{{ "Download Uploaded Receipt" }}</span>
              </a>
            </v-list-item>

            <!-- Add more details as needed -->
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-container>
    <Modal :modal="openDialogForm" :width="600">
      <template v-slot:header>
        <ModalHeader :title="`Confirm Payment Document`" />
      </template>
      <template v-slot:body>
        <ModalBody v-if="formData2">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <label for="file" class="label">
                    <small class="t-color">
                      {{ "Attachment " }}
                    </small>
                  </label>
                  <v-file-input
                    @change="saveFile($event)"
                    color=""
                    placeholder="Attach Payment Receipt"
                    filled
                    outlined
                    :show-size="1000"
                    accept="application/pdf"
                  >
                  </v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn color="red darken-1" text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="save">{{ "Save" }} </v-btn>
        </ModalFooter>
      </template>
    </Modal>
  </v-card>
</template>

<script>
import { uploadFile, saveRegistration, getRegInfo } from "./services";
export default {
  name: "UserProfile",
  data() {
    return {
      userx: "/user.jpeg",
      user: null,
      openDialogForm: false,
      formData2: { path_file: "", userId: "" },
      regInfromation: "",

      companyName: "Your Company Name",
      companyAddress: "123 Business Street, City",
      companyPhone: "+1 234 567 890",
      companyEmail: "info@yourcompany.com",
      companyWebsite: "www.yourcompany.com",
    };
  },
  mounted() {
    this.getUserFromLocalStorage();

    // Retrieve user from local storage when the component is mounted
    if (this.user.jisajilis.length > 0) {
      this.getUserRegistrationInfo();
    }
  },
  methods: {
    getStatusText(status) {
      console.log("status", status);
      if (status == false) {
        return "Pending";
      } else if (status == true) {
        return "Approved";
      } else {
        return ""; // or any other default value you want for null status
      }
    },

    getFullFilePath(path) {
      // Assuming "uploads/path_file" is the prefix
      return `uploads/${path}`;
    },

    getUserFromLocalStorage() {
      console.log("set user");
      // Get the user data from local storage
      const userJson = localStorage.getItem("GRM_USER");

      // Parse the JSON data
      if (userJson) {
        this.user = JSON.parse(userJson);
      }
    },

    getUserRegistrationInfo() {
      const regSearchTerm = this.user.id;
      getRegInfo({ regSearchTerm }).then((response) => {
        this.regInfromation = response.data;
      });
    },
    openDialog() {
      this.openDialogForm = true;
    },
    cancelDialog() {
      this.openDialogForm = false;
    },
    save() {
      console.log("formData", this.formData);
      this.openDialogForm = false;

      saveRegistration(this.formData2).then((response) => {
        // console.log("response:", response);
        this.getUserRegistrationInfo();
        this.openDialogForm = false;
        this.formData2 = { path_file: "", userId: "" };
      });
    },

    saveFile(file) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        uploadFile(formData).then((response) => {
          console.log("response:", response);
          const fileInfo = {
            file_path: response.data.current_name,
          };
          console.log("path:", this.formData2);
          this.formData2.path_file = response.data.current_name;
          this.formData2.userId = this.user.id;
          this.formData2.status = true;
          //remove duplicates but keep the last updated score!
          // data.formData.files.reverse();
          // data.formData.files = _.uniqBy(data.formData2, "current_name");
          // this.loading2 = false;
        });
      }
    },
  },
};
</script>

<style scoped>
.custom-card {
  background-image: url(/bg.jpg) !important;
  background-size: cover; /* Ensures the image covers the entire card */
  background-position: center; /* Centers the image within the card */
  color: white; /* Set the text color to white or another contrasting color */
}
.bdt {
  border-top: solid 5px #0867a6;
}
.bdt2 {
  border-top: solid 5px #0874a6 !important;
}
/* Add your custom styles here to make it visually appealing */
</style>
