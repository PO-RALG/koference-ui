<template>
  <!-- About page content -->
  <v-container class="mt-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center mb-5 color-title">
          Abstract submission {{ currentYear }}
        </h1>
        <hr class="centered-line" />
        <v-divider class="mb-5"></v-divider>

        <!-- Sample about content -->
        <v-row>
          <v-col cols="12" md="12">
            <!--            <v-card>-->
            <v-card elevetion="1">
              <!-- Form Content -->
              <v-form v-model="valid" @submit.prevent="submitForm">
                <v-container>
                  <!-- Select Category -->
                  <v-row align="center" justify="center">
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

                  <v-row align="center" justify="center">
                    <v-col cols="12" md="12">
                      <v-select
                        outlined
                        v-model="formData.subTheme"
                        :items="[
                          'Nutrition and NCDs',
                          'NCD Emergency preparedness',
                        ]"
                        label="Select Conference Sub-Theme"
                      >
                      </v-select>
                    </v-col>
                  </v-row>

                  <v-row align="center" justify="center">
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
                  <v-row align="center" justify="center">
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
                  <v-row align="center" justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.background"
                        label="Background"
                        placeholder="Enter your background here, maximum 50 words..."
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <!-- Description Field -->
                  <v-row align="center" justify="center">
                    <v-col cols="6" md="12">
                      <v-text-field
                        outlined
                        v-model="formData.objective"
                        label="Objective/Aims"
                        placeholder="Enter your Objective/Aims here..."
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row align="center" justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.methodology"
                        label="Methodology/Project plan"
                        placeholder="Enter your Methodology/Project plan here, maximum 75 words..."
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row align="center" justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.results"
                        label="Results/Progress"
                        placeholder="Enter your Results/Progress here, maximum 130 words..."
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row align="center" justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.conclusion"
                        label="Conclusion/Lessons learned"
                        placeholder="Enter your Results/Progress here, maximum 15 words..."
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row align="center" justify="center">
                    <v-col cols="12" md="12">
                      <v-textarea
                        outlined
                        v-model="formData.recommendations"
                        label="Recommendations"
                        placeholder="Enter your Recommendations here, maximum 15 words..."
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
import { create } from "./services";
export default {
  name: "Abstract",
  data() {
    return {
      formData: {
        email: "",
        title: "",

        // Other form fields...
      },
      currentYear: new Date().getFullYear(),
      valid: true,
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
        (v) => /\d/.test(v) || "Password must contain at least one digit",
        (v) =>
          /[A-Z]/.test(v) ||
          "Password must contain at least one uppercase letter",
        (v) =>
          /[a-z]/.test(v) ||
          "Password must contain at least one lowercase letter",
      ],
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

  methods: {
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

      // try {
      //   const response = await axios.post(
      //     "http://localhost:3200/api/v1/abstarcts",
      //     this.formData
      //   );

      //   // Check if the response status is in the success range (200-299)
      //   if (response.status >= 200 && response.status < 300) {
      //     // Handle the successful response data as needed

      //     // If the request is successful, close dialog1
      //     this.resetFormData();
      //   } else {
      //     console.error("Unsuccessful response status:", response.status);

      //     // Handle the response status as needed
      //   }
      // } catch (error) {
      //   console.error("Error sending POST request:", error);

      //   // Handle the error as needed
      // }
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
