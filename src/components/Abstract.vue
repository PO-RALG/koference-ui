<template>
  <!-- About page content -->
  <v-container class="mt-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center mb-0 color-title">
          Abstract submission {{ currentYear }}
        </h1>
        <h3 class="text-center">
          <span class="warning--text">Final date: 10/03/2024</span>
        </h3>
        <hr class="centered-line" />
        <v-divider class="mb-2"></v-divider>

        <!-- Sample about content -->
        <v-row>
          <v-col cols="12" md="12">
            <!--            <v-card>-->
            <v-card flat color="#f3f5f5" elevation="0">
              <!-- Form Content -->
              <v-form v-model="valid" @submit.prevent="submitForm">
                <v-container>
                  <!-- Select Category -->
                  <v-row justify="center">
                    <v-col cols="12" md="6">
                      <v-text-field
                        :value="formData.email"
                        @input="updateEmail"
                        :rules="emailRules"
                        label="Valid E-mail"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.title"
                        :rules="nameRules"
                        @input="updateTitle"
                        label="Title"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-select
                        outlined
                        v-model="formData.subTheme"
                        :items="subThemes"
                        item-text="name"
                        item-value="id"
                        label="Select Conference Sub-Theme"
                        clearable
                        class="align-left-dropdown"
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row justify="center">
                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="formData.author"
                        :rules="nameRules"
                        label="Authors"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.affiliation"
                        :rules="nameRules"
                        label="Affiliation"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.presenting_author"
                        :rules="nameRules"
                        label="Presenting author"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Name Fields -->
                  <v-row justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.background"
                        label="Background"
                        placeholder="Enter your background here, maximum 200 words..."
                        :rules="[maxRule]"
                        :hint="wordCountBackround"
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <!-- Description Field -->
                  <v-row justify="center">
                    <v-col cols="12" md="12">
                      <v-text-field
                        outlined
                        v-model="formData.objective"
                        label="Objective/Aims"
                        placeholder="Enter your Objective/Aims here..."
                      ></v-text-field>
                      <!-- <v-alert
                        v-if="wordCount > maxWordLimit"
                        type="error"
                        dense
                      >
                        Maximum word limit exceeded ({{ maxWordLimit }} words).
                      </v-alert> -->
                    </v-col>
                  </v-row>

                  <v-row justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.methodology"
                        label="Methodology/Project plan"
                        placeholder="Enter your Methodology/Project plan here, maximum 200 words..."
                        :rules="[maxRule]"
                        :hint="wordCount"
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.results"
                        label="Results/Discussions"
                        placeholder="Enter your Results/Progress here,"
                        :rules="[maxRule]"
                        :hint="wordCountResults"
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.conclusion"
                        label="Conclusion/Lessons learned"
                        placeholder="Enter your Results/Progress here,"
                        :rules="[maxRule]"
                        :hint="wordCountConclusion"
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.recommendations"
                        label="Recommendations"
                        placeholder="Enter your Recommendations here,"
                        :rules="[maxRule]"
                        :hint="wordCountRecomendation"
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row class="text-center">
                    <v-col>
                      <v-card-text class="pa-10" style="text-align: center">
                        <v-row
                          ><h4>
                            I consent that my abstract be published in peer
                            review journal
                          </h4>
                        </v-row>
                        <v-col>
                          <!--              @change="handleRadioChange"-->
                          <v-radio-group
                            style="margin-left: auto"
                            v-model="formData.inline"
                            inline
                          >
                            <v-radio label="Yes" value="Yes"></v-radio>
                            <v-radio label="No" value="No"></v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-card-text>
                    </v-col>
                  </v-row>

                  <!-- Buttons -->
                  <v-card-actions class="pt-n8 pb-5 pr-5">
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="cancelForm">Cancel</v-btn>

                    <!-- Reset Button -->
                    <v-btn @click="resetFormData" color="info">Reset</v-btn>

                    <!-- Submit Button -->
                    <v-btn type="submit" color="primary">Submit</v-btn>
                  </v-card-actions>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import Vue from "vue";

import { create, getSubthemes } from "./services"; // Fix the import statement
export default {
  name: "Abstract",
  data() {
    return {
      maxWordLimit: 200, // Set your desired word limit
      maxWordLimitBackground: 200, // Set your desired word limit
      formData: {
        email: "",
        title: "",
        objective: "",
        methodology: "",
        background: "",
        results: "",
        conclusion: "",
        recommendations: "",

        // Other form fields...
      },
      subThemes: [],

      currentYear: new Date().getFullYear(),
      valid: true,

      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      phoneNumber: "",
      phoneRules: [
        (v) => !!v || "Phone number is required",
        (v) => /^\d{10}$/.test(v) || "Phone number must be 10 digits",
      ],
      description: "",
      nameRules: [(v) => !!v || "This field is required"],
    };
  },
  computed: {
    wordCount() {
      // Remove extra whitespaces and split the text into words
      const words = this.formData?.methodology.trim().split(/\s+/);
      return `${words.length} words`;
      // return words.length;
    },
    wordCountBackround() {
      // Remove extra whitespaces and split the text into words
      const words = this.formData?.background.trim().split(/\s+/);
      return `${words.length} words`;
    },
    wordCountResults() {
      // Remove extra whitespaces and split the text into words
      const words = this.formData?.results.trim().split(/\s+/);
      return `${words.length} words`;
    },
    wordCountConclusion() {
      // Remove extra whitespaces and split the text into words
      const words = this.formData?.conclusion.trim().split(/\s+/);
      return `${words.length} words`;
    },
    wordCountRecomendation() {
      // Remove extra whitespaces and split the text into words
      const words = this.formData?.recommendations.trim().split(/\s+/);
      return `${words.length} words`;
    },
    isFieldDisabled() {
      return this.wordCount > this.maxWordLimit;
    },
  },
  validations: {
    formData: {
      objective: {
        maxLength: (value) => {
          return value.split(/\s+/).length <= this.maxWordLimit;
        },
      },
    },
  },
  created() {
    this.fetchSubthemes();
    Vue.nextTick(() => {
      // This will be executed after the DOM has been updated
      window.scrollTo(0, 0); // Scroll to the top
    });
  },
  methods: {
    fetchSubthemes() {
      getSubthemes().then((response) => {
        if (response.status >= 200 && response.status < 300) {
          this.subThemes = response.data; // Update this line
        }
      });
    },
    maxRule(value) {
      return (
        value.split(/\s+/).length <= this.maxWordLimit ||
        "Maximum word limit exceeded."
      );
    },

    updateEmail(value) {
      this.formData.email = value.toLowerCase();
    },
    updateTitle(value) {
      this.formData.title = value.toUpperCase();
    },

    goHome() {
      this.$router.push({ path: "/" });
    },
    goAbout() {
      this.$router.push({ path: "/about" });
    },
    handleButtonClick1() {
      // Handle the first button click
    },
    resetFormData() {
      this.formData = {
        email: "",
        title: "",
        objective: "",
        methodology: "",
        background: "",
        results: "",
        conclusion: "",
        recommendations: "",
        // Other form fields...
      };
      this.$refs.submitForm?.resetValidation(); // Replace "form" with the ref attribute of your form element
    },
    clearSelection() {
      this.category = null;
    },
    cancelForm() {
      this.$router.push({ path: "/" });
      // this.dialog = false;
    },
    formatPhoneNumber() {
      // Handle phone number formatting logic
    },

    async submitForm() {
      create(this.formData).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          this.resetFormData();
        }
      });
    },
  },
};
</script>

<style>
/* Add your custom styles here */
.color-title {
  color: grey;
}
.centered-line {
  width: 25%;
  border: 3px solid grey; /* Adjust thickness as needed */
  margin: 8px auto; /* Adjust as needed */
}
</style>
<style>
.align-left-dropdown .v-input__slot {
  text-align: left !important;
}
</style>
