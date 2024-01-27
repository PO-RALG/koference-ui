<template>
  <v-container class="mt-12">
    <v-col cols="12">
      <h1 class="text-center mb-5 color-title">Select Category to Register</h1>
      <hr class="centered-line" />
      <v-divider class="mb-5"></v-divider>
    </v-col>
    <v-card>
      <v-row class="text-center">
        <v-col>
          <v-card-text class="">
            <v-row style="margin-left: 45%"
              ><h4>Registration Categories</h4>
            </v-row>
            <v-radio-group
              @change="openDialog('dialog1')"
              style="margin-left: 40%"
              row
            >
              <v-radio label="Individual" value="Individual"></v-radio>
              <v-radio label="Booth" value="Booth"></v-radio>
              <v-radio label="Forum" value="Forum"></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-col>
      </v-row>
      <!-- Horizontal line (hr) -->
      <hr />
      <div style="background-color: rgb(242, 242, 242); ruby-position: under">
        <v-container>
          <v-data-table :items="tableData" :headers="tableHeaders">
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.sno }}</td>
                <td>{{ item.categoryName }}</td>
                <td>{{ item.fees }}</td>
                <td>
                  <v-btn
                    class="ma-1"
                    color="blue-grey darken-3"
                    plain
                    @click="openDialog(item.dialogName)"
                  >
                    View Details
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-container>
      </div>
      <!-- Horizontal line (hr) -->
      <hr />
      <!--      <h4>HELLO</h4>-->
      <Modal :modal="dialogs.dialog1" :width="1200">
        <template v-slot:header>
          <ModalHeader :title="`Conference Registration Form`" />
        </template>
        <template v-slot:body>
          <ModalBody>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      outlined
                      v-model="category"
                      :items="registrationCategories"
                      item-text="name"
                      item-value="id"
                      label="Select Category"
                      clearable
                    >
                    </v-select>
                  </v-col>

                  <!-- item-title="name"-->
                  <v-col cols="12" md="6">
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
                  <v-col cols="12" md="4">
                    <v-text-field
                      outlined
                      v-model="firstname"
                      :rules="nameRules"
                      label="First name"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="middlename"
                      :rules="nameRules"
                      label="Middle name"
                      required
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="lastname"
                      :rules="nameRules"
                      label="Last name"
                      required
                      outlined
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
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="username"
                      :rules="nameRules"
                      label="User Name"
                      required
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      label="Password"
                      outlined
                      required
                      type="password"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Description Field -->
                <v-row align="center" justify="center">
                  <v-col cols="6" md="12">
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
            <v-btn color="error" @click="closeDialog('dialog1')">Cancel</v-btn>
            <v-btn color="info" @click="resetForm">Reset</v-btn>
            <v-btn type="submit" color="primary" @click="postData"
              >Submit</v-btn
            >
          </ModalFooter>
        </template>
      </Modal>

      <v-dialog v-model="dialogs.dialog2" max-width="500">
        <v-card>
          <v-card-title style="background-color: #d1d4d4">
            Package Details
            <!--            <v-btn icon @click="closeDialog('dialog1')">-->
            <!--              <v-icon>mdi-close</v-icon>-->
            <!--            </v-btn>-->
          </v-card-title>

          <v-card-text>
            <!-- Content of Dialog 1 goes here -->
            <ol>
              <li>Trophy and certificate</li>
              <li>
                Inclusion of the organization logo in the official banner for
                sponsors
              </li>
              <li>
                Display of advert and a short clip of the organization’s
                services in the registration portal and conference screens
              </li>
              <li>Free participation of 4 representatives</li>
              <li>2 Minutes talk, in the Main Hall, about their businesses</li>
              <li>2 Booths</li>
            </ol>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="closeDialog('dialog2')">Close</v-btn>
            <!--            <v-btn color="primary" @click="performAction('dialog2')">Perform Action</v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogs.dialog3" max-width="500">
        <v-card>
          <v-card-title style="background-color: #d1d4d4">
            Package Details
            <!--            <v-btn icon @click="closeDialog('dialog1')">-->
            <!--              <v-icon>mdi-close</v-icon>-->
            <!--            </v-btn>-->
          </v-card-title>

          <v-card-text>
            <!-- Content of Dialog 1 goes here -->
            <ol>
              <li>Trophy and certificate</li>
              <li>
                Inclusion of the organization logo in the official banner for
                sponsors
              </li>
              <li>
                Display of advert and a short clip of the organization’s
                services in the registration portal and conference screens
              </li>
              <li>Free participation of 4 representatives</li>
              <li>2 Minutes talk, in the Main Hall, about their businesses</li>
              <li>2 Booths</li>
            </ol>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="closeDialog('dialog3')">Close</v-btn>
            <!--            <v-btn color="primary" @click="performAction('dialog2')">Perform Action</v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogs.dialog4" max-width="500">
        <v-card>
          <v-card-title style="background-color: #d1d4d4">
            Package Details
            <!--            <v-btn icon @click="closeDialog('dialog1')">-->
            <!--              <v-icon>mdi-close</v-icon>-->
            <!--            </v-btn>-->
          </v-card-title>

          <v-card-text>
            <!-- Content of Dialog 1 goes here -->
            <ol>
              <li>Trophy and certificate</li>
              <li>
                Inclusion of the organization logo in the official banner for
                sponsors
              </li>
              <li>
                Display of advert and a short clip of the organization’s
                services in the registration portal and conference screens
              </li>
              <li>Free participation of 4 representatives</li>
              <li>2 Minutes talk, in the Main Hall, about their businesses</li>
              <li>2 Booths</li>
            </ol>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="closeDialog('dialog4')">Close</v-btn>
            <!--            <v-btn color="primary" @click="performAction('dialog2')">Perform Action</v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogs.dialog5" max-width="500">
        <v-card>
          <v-card-title style="background-color: #d1d4d4">
            Package Details
            <!--            <v-btn icon @click="closeDialog('dialog1')">-->
            <!--              <v-icon>mdi-close</v-icon>-->
            <!--            </v-btn>-->
          </v-card-title>

          <v-card-text>
            <!-- Content of Dialog 1 goes here -->
            <ol>
              <li>Trophy and certificate</li>
              <li>
                Inclusion of the organization logo in the official banner for
                sponsors
              </li>
              <li>
                Display of advert and a short clip of the organization’s
                services in the registration portal and conference screens
              </li>
              <li>Free participation of 4 representatives</li>
              <li>2 Minutes talk, in the Main Hall, about their businesses</li>
              <li>2 Booths</li>
            </ol>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="closeDialog('dialog5')">Close</v-btn>
            <!--            <v-btn color="primary" @click="performAction('dialog2')">Perform Action</v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogs.dialog6" max-width="500">
        <v-card>
          <v-card-title style="background-color: #d1d4d4">
            Package Details
            <!--            <v-btn icon @click="closeDialog('dialog1')">-->
            <!--              <v-icon>mdi-close</v-icon>-->
            <!--            </v-btn>-->
          </v-card-title>

          <v-card-text>
            <!-- Content of Dialog 1 goes here -->
            <ol>
              <li>Trophy and certificate</li>
              <li>
                Inclusion of the organization logo in the official banner for
                sponsors
              </li>
              <li>
                Display of advert and a short clip of the organization’s
                services in the registration portal and conference screens
              </li>
              <li>Free participation of 4 representatives</li>
              <li>2 Minutes talk, in the Main Hall, about their businesses</li>
              <li>2 Booths</li>
            </ol>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="closeDialog('dialog6')">Close</v-btn>
            <!--            <v-btn color="primary" @click="performAction('dialog2')">Perform Action</v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogs.dialog7" max-width="500">
        <v-card>
          <v-card-title style="background-color: #d1d4d4">
            Package Details
            <!--            <v-btn icon @click="closeDialog('dialog1')">-->
            <!--              <v-icon>mdi-close</v-icon>-->
            <!--            </v-btn>-->
          </v-card-title>

          <v-card-text>
            <!-- Content of Dialog 1 goes here -->
            <ol>
              <li>Trophy and certificate</li>
              <li>
                Inclusion of the organization logo in the official banner for
                sponsors
              </li>
              <li>
                Display of advert and a short clip of the organization’s
                services in the registration portal and conference screens
              </li>
              <li>Free participation of 4 representatives</li>
              <li>2 Minutes talk, in the Main Hall, about their businesses</li>
              <li>2 Booths</li>
            </ol>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="closeDialog('dialog7')">Close</v-btn>
            <!--            <v-btn color="primary" @click="performAction('dialog2')">Perform Action</v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <div>
      <table>
        <thead>
          <tr style="text-align: left">
            <th>S/No</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Country</th>
            <th>Category</th>
            <th>Email</th>
            <th>Phone Number</th>
            <!--            <th>Description</th>-->
            <!-- Add more headers as needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in fetchedData" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.firstname }}</td>
            <td>{{ item.middlename }}</td>
            <td>{{ item.lastname }}</td>
            <td>{{ item.country }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phoneNumber }}</td>
            <!--            <td>{{ item.description }}</td>-->
            <!-- Display more properties as needed -->
          </tr>
        </tbody>
      </table>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: [
        {
          sno: 1,
          categoryName: "Health Worker",
          fees: "100,000 TShs.",
          dialogName: "dialog2",
        },
        {
          sno: 2,
          categoryName: "University Student",
          fees: "100,000 TShs.",
          dialogName: "dialog3",
        },
        {
          sno: 3,
          categoryName: "Non student",
          fees: "150,000 TShs.",
          dialogName: "dialog4",
        },
        {
          sno: 4,
          categoryName: "Foreigner/international",
          fees: "£USD 100",
          dialogName: "dialog5",
        },
        {
          sno: 5,
          categoryName: "Booth",
          fees: "2,000,000 TSh.",
          dialogName: "dialog6",
        },
        {
          sno: 6,
          categoryName: "Forum",
          fees: "10,000,000 TSh.",
          dialogName: "dialog7",
        },
      ],
      tableHeaders: [
        { text: "S/No", value: "sno" },
        { text: "Category Name", value: "categoryName" },
        { text: "Fees", value: "fees" },
        { text: "Actions", value: "actions" },
      ],
      fetchedData: null,
      registrationCategories: [],
      countries: [],
      // postData: null,
      dialogs: {
        dialog1: false,
        dialog2: false,
        dialog3: false,
        dialog4: false,
        dialog5: false,
        dialog6: false,
        dialog7: false,
      },
      valid: true,
      inline: true,
      selectedOption: null,
      // modalVisible: false,
      country: null,
      category: null,
      gender: null,
      selectedGender: null,
      selectedCategoryItem: null,
      column: null,
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      password: "",
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
      username: "",
      phoneRules: [
        (v) => !!v || "Phone number is required",
        (v) => /^\d{10}$/.test(v) || "Phone number must be 10 digits",
      ],
      description: "",
      nameRules: [],
    };
  },
  created() {
    // Call the fetchData method when the component is mounted
    // this.fetchData();
    this.fetchCountries();
    this.fetchRegistrationCategories();
  },
  methods: {
    async postData() {
      try {
        const response = await axios.post(
          "http://localhost:3200/api/v1/users",
          {
            country: this.country,
            category: this.category,
            sex: this.gender,
            first_name: this.firstname,
            middle_name: this.middlename,
            last_name: this.lastname,
            countryId: 1,
            email: this.email,
            password: this.password,
            phone_number: this.phoneNumber,
            username: this.username,
            description: this.description,
            // Add more key-value pairs as needed
          }
        );

        // Check if the response status is in the success range (200-299)
        if (response.status >= 200 && response.status < 300) {
          // Handle the successful response data as needed

          // If the request is successful, close dialog1
          this.dialogs.dialog1 = false;
          this.resetForm();
        } else {
          console.error("Unsuccessful response status:", response.status);

          // Handle the response status as needed
        }
      } catch (error) {
        console.error("Error sending POST request:", error);

        // Handle the error as needed
      }
    },

    async fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/registration");
        this.fetchedData = response.data; // Update this line
        // console.log('MyData:', JSON.parse(JSON.stringify(this.fetchedData)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async fetchCountries() {
      try {
        const countries = await axios.get(
          "http://localhost:3200/api/v1/countries"
        );

        this.countries = countries.data; // Update this line
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async fetchRegistrationCategories() {
      try {
        const registrationCategories = await axios.get(
          "http://localhost:3200/api/v1/registartioncategories"
        );

        this.registrationCategories = registrationCategories.data; // Update this line
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    openDialog(dialogName) {
      console.log("mmm", dialogName);

      this.dialogs[dialogName] = true;
    },

    closeDialog(dialogName) {
      this.dialogs[dialogName] = false;
    },

    performAction(dialogName) {
      // Logic for performing an action when a button in the dialog is clicked
      console.log(`Action performed in ${dialogName}`);
    },
    submitForm() {
      // Your form submission logic here
    },
    resetForm() {
      // Reset form fields
      this.country = "";
      this.category = "";
      this.gender = "";
      this.firstname = "";
      this.middlename = "";
      this.lastname = "";
      this.email = "";
      this.password = "";
      this.phoneNumber = "";
      this.username = "";
      this.description = "";
      // Reset validation state if using validation
      this.$refs.submitForm?.resetValidation(); // Replace "form" with the ref attribute of your form element
    },
    clearSelection() {
      this.category = null;
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
<style>
/* Add your custom styles here */
.color-title {
  color: grey;
  /* background-color: rgb(242, 242, 242); */
}
.custom-th {
  /* Add your custom styles for the table header cells */
  padding-right: 1000px; /* Adjust the padding as needed */
  text-align: left;
  /* Add any other styles as needed */
}
td {
  padding-right: 100px;
  text-align: left;
  /*border: 1px solid #ccc;*/
}

.centered-line {
  width: 25%;
  border: 3px solid grey; /* Adjust thickness as needed */
  margin: 8px auto; /* Adjust as needed */
}
</style>
