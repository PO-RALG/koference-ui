<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <h3 style="text-align: center; margin-top: 20px">Conference Registration Form</h3>
      <!-- Form Content -->
      <v-form v-model="valid" @submit.prevent="submitForm">
        <v-container fluid fill-height>
          <!-- Select Category -->
          <v-row align="center" justify="center">
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedItem"
                :items="['Student', 'Non Student']"
                label="Select Category"
              >
                <template #append-outer>
                  <v-icon @click="clearSelection">mdi-close-circle</v-icon>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="selectedItem"
                :items="['Tanzania', 'Kenya', 'Uganda']"
                label="Select Country"
              >
                <template #append-outer>
                  <v-icon @click="clearSelection">mdi-close-circle</v-icon>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <h4>Gender</h4>
            <hr>
            <v-radio-group
              v-model="inline"
              inline
            >
              <v-radio
                label="Male"
                value="Male"
              ></v-radio>
              <v-radio
                label="Female"
                value="Female"
              ></v-radio>
            </v-radio-group>
          </v-row>

          <!-- Name Fields -->
          <v-row align="center" justify="center">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="firstname"
                :rules="nameRules"
                :counter="10"
                label="First name"
                required
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="middlename"
                :rules="nameRules"
                :counter="10"
                label="Middle name"
                required
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="lastname"
                :rules="nameRules"
                :counter="10"
                label="Last name"
                hide-details
                required
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
                hide-details
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="phoneNumber"
                :rules="phoneRules"
                label="Phone Number"
                @input="formatPhoneNumber"
                hide-details
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Description Field -->
          <v-row align="center" justify="center">
            <v-col cols="12" md="12">
              <v-textarea
                v-model="description"
                :counter="300"
                label="Description"
                placeholder="Enter your description here..."
              ></v-textarea>
            </v-col>
          </v-row>

          <!-- Buttons -->
          <v-row class="mt-4">
            <!-- Cancel Button -->
            <v-col>
              <v-btn @click="cancelForm">Cancel</v-btn>
            </v-col>
            <!-- Reset Button -->
            <v-col>
              <v-btn @click="resetForm" color="error">Reset</v-btn>
            </v-col>
            <!-- Submit Button -->
            <v-col>
              <v-btn type="submit" color="primary">Submit</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      valid: false,
      selectedItem: null,
      // dropdownItems: [
      //   { text: 'Option A' },
      //   { text: 'Option B' },
      //   { text: 'Option C' },
      // ], // Populate with your dropdown items
      column: null,
      inline: null,
      firstname: '',
      middlename: '',
      lastname: '',
      email: '',
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
      phoneNumber: '',
      phoneRules: [
        (v) => !!v || 'Phone number is required',
        (v) => /^\d{10}$/.test(v) || 'Phone number must be 10 digits',
      ],
      description: '',
      nameRules: [], // Define your name validation rules
    };
  },
  methods: {
    resetForm() {
      // Reset form fields
      this.firstname = '';
      this.middlename = '';
      this.lastname = '';
      this.email = '';
      this.phoneNumber = '';
      this.description = '';
      // Reset validation state if using validation
      this.$refs.submitForm?.resetValidation(); // Replace "form" with the ref attribute of your form element
    },
    clearSelection() {
      this.selectedItem = null;
    },
    submitForm() {
      // Handle form submission logic
    },
    cancelForm() {
      // Handle cancel logic
      this.dialog = false;
    },
    formatPhoneNumber() {
      // Handle phone number formatting logic
    },
  },
};
</script>
