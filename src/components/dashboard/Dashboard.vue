<template>
  <v-card flat class="">
    <v-container>
      <v-card-actions class="pa-0">
        <h2>{{ "Profile Details" }}</h2>

        <v-spacer></v-spacer>

        <v-btn
          class="white--text"
          color="green"
          large
          @click="openUpdateDialog(userb)"
        >
          <v-icon color="white">mdi-account</v-icon>
          Update Profile
        </v-btn>
        <v-btn color="primary" large @click="openDialog()">
          <v-icon>mdi-plus</v-icon>
          Payment Cofirmation
        </v-btn>
      </v-card-actions>
      <v-card flat max-width="100%" class="">
        <v-card-actions>
          <span
            >Payment Status:
            {{
              getStatusText(
                this.userb &&
                  this.userb.jisajilis &&
                  this.userb.jisajilis[0].status
                  ? true
                  : false
              )
            }}</span
          >
        </v-card-actions>
        <!-- <v-card-actions>
          <span
            >Abstract Status:
            {{
              getStatusText(
                this.userb &&
                  this.userb.jisajilis &&
                  this.userb.jisajilis[0].status
                  ? true
                  : false
              )
            }}</span
          >
        </v-card-actions> -->
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
        <h1><hr class="centered-line2" /></h1>
        <v-container>
          <v-row justify="start">
            <v-col cols="12" sm="9" md="7">
              <v-card color="grey" flat class="elevation-1 custom-card bdt2">
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
                    <h2 class="text-h3 green--text">
                      <strong>
                        {{ userb?.salutation }} {{ "" }}
                        {{ userb?.first_name }} {{ " " }}{{ userb?.last_name }}
                      </strong>
                    </h2>
                    <v-spacer></v-spacer>
                    <h2 class="text-h6 green--text">
                      <strong>
                        {{ "ID" }}{{ " : " }} {{ userb?.user_identification }}
                      </strong>
                    </h2>
                  </v-card-actions>

                  <!-- Company Information -->
                  <div class="text-start">
                    <p>
                      <span class="font-weight-bold grey--text">
                        <v-icon color="grey">mdi-office-building</v-icon>

                        {{ "Organization" }}{{ " : " }}
                      </span>
                      <span class="white--text">
                        {{ userb?.organization }}
                      </span>
                    </p>
                    <p>
                      <span class="font-weight-bold grey--text">
                        <v-icon color="grey">mdi-map-marker-outline</v-icon>

                        {{ "Nationality" }}{{ " : " }}
                      </span>
                      <span class="white--text">
                        {{ userb?.country.name }}
                      </span>
                    </p>
                    <p>
                      <span class="font-weight-bold grey--text">
                        <v-icon color="grey">mdi-phone</v-icon>
                        {{ "Phone" }}{{ " : " }}
                      </span>
                      <span class="white--text">
                        {{ userb?.phone_number }}
                      </span>
                    </p>
                    <p>
                      <span class="font-weight-bold grey--text">
                        <v-icon color="grey">mdi-email</v-icon>
                        {{ "Email" }}{{ " : " }}
                      </span>
                      <span class="white--text">
                        {{ userb?.email }}
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
        <!-- <v-list-item>
          <span
            >{{ "Payment Confirmation Date" }}{{ " : " }}
            {{ regInfromation?.createdAt | format() }}</span
          >
        </v-list-item> -->

        <v-divider class="my-3"></v-divider>
      </v-card>
    </v-container>
    <Modal :modal="dialogs.dialog1" :width="1200">
      <template v-slot:header>
        <ModalHeader
          @closeDialog="closeDialog('dialog1')"
          :title="`Update your profile`"
        />
      </template>
      <template v-slot:body>
        <ModalBody>
          <v-col cols="12" md="6">
            <v-sheet>
              <p class="text-uppercase">
                <strong>Registered Group:</strong> {{ group }}
              </p>
            </v-sheet>
          </v-col>
          <v-form v-model="valid" @submit.prevent="submitForm">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-if="group === 'Individual'"
                    outlined
                    v-model="registationcategory"
                    :items="registrationCategories"
                    item-text="name"
                    item-value="id"
                    label="Select Category"
                    clearable
                  >
                  </v-select>
                  <!-- <v-text-field
                      v-else
                      outlined
                      v-model="organization"
                      :rules="nameRules"
                      label="Organization"
                      required
                      @input="updateOrganization"
                    ></v-text-field> -->
                </v-col>

                <!-- item-title="name"-->
                <v-col
                  :cols="group === 'Individual' ? 12 : 12"
                  :md="group === 'Individual' ? 6 : 12"
                >
                  <v-autocomplete
                    outlined
                    v-model="country"
                    :items="countries"
                    color="blue-grey-lighten-2"
                    item-text="name"
                    item-value="id"
                    label="Select Country"
                    clearable
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="12">
                  <v-select
                    outlined
                    v-model="gender"
                    :items="['Male', 'Female']"
                    label="Select Gender"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <!-- Name Fields -->
              <v-row align="center" justify="center">
                <v-col cols="12" md="6">
                  <v-select
                    clearable
                    outlined
                    v-model="salutation"
                    :items="[
                      'Mr.',
                      'Mr.',
                      'Dr.',
                      'Prof.',
                      'Ms',
                      'Miss',
                      'Rev.',
                      'Hon',
                      'Capt',
                      'Sir',
                      'Lord',
                      'Lady.',
                      'Esq.',
                    ]"
                    label=" Select Salutation (e.g Mr/Mr/Dr./Prof etc)"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    outlined
                    v-model="organization"
                    :rules="nameRules"
                    label="Organization"
                    required
                    @input="updateOrganization"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    outlined
                    v-model="firstname"
                    :rules="nameRules"
                    label="First name"
                    required
                    @input="updateFirstName"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="middlename"
                    :rules="nameRules"
                    label="Middle name"
                    required
                    outlined
                    @input="updateMiddleName"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="lastname"
                    :rules="nameRules"
                    label="Last name"
                    required
                    outlined
                    @input="updateLastName"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Email and Phone Number Fields -->
              <v-row align="center" justify="center">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    outlined
                    required
                    @input="updateEmail"
                    ref="email"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="phoneNumber"
                    :rules="phoneRules"
                    label="Phone Number"
                    @input="formatPhoneNumber"
                    outlined
                    required
                    ref="phone_number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="username"
                    :rules="nameRules"
                    label="User Name"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Description Field -->
              <v-row align="center" justify="center">
                <v-col cols="12" md="12">
                  <v-textarea
                    outlined
                    v-model="description"
                    label="Description"
                    placeholder="Enter your description here..."
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ModalBody>
      </template>
      <template v-slot:footer>
        <ModalFooter>
          <v-btn block large type="submit" color="primary" @click="postData"
            >UPDATE</v-btn
          >
        </ModalFooter>
      </template>
    </Modal>
    <Modal :modal="openDialogForm" :width="600">
      <template v-slot:header>
        <ModalHeader
          @closeDialog="closeDialog()"
          :title="`Confirm Payment Document`"
        />
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
    <!-- <ConferenceRegistration /> -->
  </v-card>
</template>

<script>
import { uploadFile, saveRegistration, getRegInfo } from "./services";
import {
  registerUser,
  updateUser,
  getCountries,
  getRegistrationCategories,
} from "../services";
// import ConferenceRegistration from "../Authentication.vue";

export default {
  name: "UserProfile",
  components: {
    // ConferenceRegistration,
  },
  data() {
    return {
      userx: "/user.jpeg",
      user: null,
      userb: null,
      openDialogForm: false,
      formData2: { path_file: "", userId: "" },
      regInfromation: "",
      dialogs: {
        dialog1: false,
      },
      country: "",
      registationcategory: "",
      gender: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phoneNumber: "",
      username: "",
      group: "",
      description: "",
      salutation: "",
      organization: "",
    };
  },
  mounted() {
    this.getUserFromLocalStorage();

    // Retrieve user from local storage when the component is mounted
    if (this.userb.jisajilis.length > 0) {
      this.getUserRegistrationInfo();
    }
    this.fetchCountries();
  },
  methods: {
    fetchCountries() {
      getCountries().then((response) => {
        if (response.status >= 200 && response.status < 300) {
          this.countries = response.data;
        }
      });
      getRegistrationCategories().then((response) => {
        if (response.status >= 200 && response.status < 300) {
          this.registrationCategories = response.data; // Update this line
        }
      });
    },
    getStatusText(status) {
      console.log("status", status);
      if (status == false) {
        return "Pending";
      } else if (status == true) {
        return "Submited";
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
        console.log("set user");

        this.userb = JSON.parse(userJson);
      }
    },

    getUserRegistrationInfo() {
      const regSearchTerm = this.userb.id;
      getRegInfo({ regSearchTerm }).then((response) => {
        this.regInfromation = response.data;
      });
    },
    openDialog() {
      this.openDialogForm = true;
    },
    closeDialog() {
      this.dialogs.dialog1 = false;
      this.openDialogForm = false;
    },
    openUpdateDialog(userb) {
      this.dialogs.dialog1 = true;
      this.country = userb.country;
      this.registationcategory = userb.registationcategory;
      this.gender = userb.sex;
      this.firstname = userb.first_name;
      this.middlename = userb.middle_name;
      this.lastname = userb.last_name;
      this.email = userb.email;
      this.phoneNumber = userb.phone_number;
      this.username = userb.username;
      this.group = userb.group;
      this.description = userb.description;
      this.salutation = userb.salutation;
      this.organization = userb.organization;
    },

    async postData() {
      try {
        const response = await updateUser({
          id: this.userb.id,
          country: this.country,
          registationcategory: this.registationcategory,
          sex: this.gender,
          first_name: this.firstname,
          middle_name: this.middlename,
          last_name: this.lastname,
          email: this.email,
          phone_number: this.phoneNumber,
          username: this.username,
          group: this.group,
          description: this.description,
          salutation: this.salutation,
          organization: this.organization,
          // Add more key-value pairs as needed
        });

        if (response.status >= 200 && response.status < 300) {
          this.dialogs.dialog1 = false;
          this.userb = response.data;
          // localStorage.setItem("GRM_USER", JSON.stringify(this.userb));
        }
      } catch (error) {
        // Handle errors if any
        console.error("Error posting data:", error);
      }
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
          this.formData2.userId = this.userb.id;
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
.centered-line2 {
  width: 100%;
  border: 3px solid rgb(26, 86, 182); /* Adjust thickness as needed */
  margin: 8px auto; /* Adjust as needed */
}
.custom-card {
  background-image: url(/bg.jpg) !important;
  background-size: cover; /* Ensures the image covers the entire card */
  background-position: center; /* Centers the image within the card */
  color: white; /* Set the text color to white or another contrasting color */
}
.bdt {
  border-top: solid 5px #96a60890;
}
.bdt2 {
  border-top: solid 2px #052f694d !important;
}
/* Add your custom styles here to make it visually appealing */
</style>
