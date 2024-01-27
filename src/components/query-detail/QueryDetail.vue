<template>
  <div>
    <h2>{{ title }}</h2>
    <v-card>
      <Modal :modal="userList" :width="700">
        <template v-slot:header>
          <ModalHeader :title="`Select User To Assign This Query`" />
        </template>
        <template v-slot:body>
          <ModalBody>
            <v-col cols="12" md="12" class="mt-n3">
              <v-select
                prepend-inner-icon="mdi-account-check"
                v-model="formData.user_id"
                :items="users"
                item-value="id"
                :item-text="'full_name'"
                label="Select assined officer"
                outlined
                required
              >
                <template v-slot:selection="{ item }">
                  {{ item.first_name }}-{{ item.last_name }}-{{
                    item.phone_number
                  }}
                </template>
                <template v-slot:prepend-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field
                        v-model="searchTerm"
                        placeholder="Search"
                        @input="searchUser"
                        outlined
                      ></v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="12" class="mt-n3">
              <v-select
                :items="queryCategories"
                prepend-inner-icon="mdi-file-document-multiple"
                label="Select query category"
                outlined
                v-model="formData.queryCategoryId"
                :item-text="'name'"
                item-value="id"
              >
                <template v-slot:selection="{ item }">
                  {{ item.name }}-{{ item.description }}
                </template>
                <template v-slot:item="{ item }">
                  {{ item.name }} -{{ item.description }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="12" class="mt-n3">
              <v-select
                :items="queryPrioorities.items"
                prepend-inner-icon="mdi-filter"
                label="Select query Priority"
                outlined
                v-model="formData.queryPriorityId"
                :item-text="'name'"
                item-value="id"
              >
                <template v-slot:selection="{ item }">
                  {{ item.name }}
                </template>
                <template v-slot:item="{ item }">
                  {{ item.name }} 
                </template>
              </v-select>
            </v-col>
          </ModalBody>
        </template>
        <template v-slot:footer>
          <ModalFooter>
            <v-btn color="green darken-1" text @click="cancelConfirmDialog"
              >Cancel</v-btn
            >
            <v-btn color="red darken-1" @click="Save" text>Submit</v-btn>
          </ModalFooter>
        </template>
      </Modal>
      <v-card-text>
        <div class="white-box">
          <div class="row">
            <div class="col-md-8">
              <div class="row DetailsDiv">
                <div class="col-md-12">
                  <div
                    class="sub-header py-2 d-flex flex-row justify-content-between"
                  >
                    <span class="time-age">
                      Age:{{ receivedData?.days_passed }}{{ " Days" }}
                      <!----></span
                    >
                    <!-- <span

                      class="time-till-resolved ng-star-inserted"
                      style=""
                    >
                      &nbsp;&nbsp; Time until resolved: (0d, 3h, 18m) </span
                    > -->
                    <!---->
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="box-detail">
                    <div class="font-weight-bold">Title</div>
                    <div class="underline-text">CLAIM FROM CLIENT</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="box-detail">
                    <div class="font-weight-bold">Track Number</div>
                    <div class="underline-text">
                      {{ receivedData?.tracknumber }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4 ng-star-inserted" style="">
                  <!---->
                  <div class="box-detail ng-star-inserted">
                    <div class="font-weight-bold">Reported to</div>
                    <div class="underline-text">Msimbazi Basin</div>
                  </div>
                  <!---->
                </div>
                <!----><!----><!---->

                <div class="col-md-4 ng-star-inserted">
                  <div class="box-detail">
                    <div class="font-weight-bold">Reported Via</div>
                    <div class="underline-text">Website</div>
                  </div>
                </div>
                <!----><!---->
                <div class="col-md-4">
                  <div class="box-detail">
                    <div class="font-weight-bold">Incidence Origin</div>
                    <div class="underline-text">EXTERNAL</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="box-detail">
                    <div class="font-weight-bold">Submission Date</div>
                    <div class="underline-text">
                      {{ receivedData?.created | format() }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="box-detail">
                    <div class="font-weight-bold">Issue Category</div>
                    <div class="underline-text">
                      {{ receivedData?.category }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4 ng-star-inserted" style="">
                  <div class="box-detail">
                    <div class="font-weight-bold">Issue Title</div>
                    <div class="underline-text">Query Submition</div>
                  </div>
                </div>
                <!---->

                <div class="col-md-4 ng-star-inserted" style="">
                  <div v-if="receivedData?.priority!=null" class="box-detail">
                    <div class="font-weight-bold">Priortiy</div>
                    <div class="underline-text">{{ receivedData?.priority}}</div>
                  </div>
                  <div v-else class="box-detail">
                    <div class="font-weight-bold">Priortiy</div>
                    <div>{{ "--------------------"}}</div>
                  </div>
                </div>
                <!---->
                <div class="col-md-4 ng-star-inserted" style="">
                  <div class="box-detail">
                    <div class="font-weight-bold">Assigned To</div>
                    <div class="underline-text" v-if="receivedData?.assignedtof">
                      {{ receivedData?.assignedtof }}
                      {{ " " }}
                      {{ receivedData?.assignedtol }}
                    </div>
                    <div v-else>
                      {{ "--------------------"}}
                    </div>
                  </div>
                </div>
                <!----><!----><!----><!----><!----><!---->
                <div class="col-md-12">
                  <div class="box-detail">
                    <div class="font-weight-bold">Description</div>
                    <div>
                      <!-- hello, -->
                      <div class="underline-text">
                        {{ receivedData?.description }}
                      </div>
                      <div><br /></div>
                      <!-- <div>Best Regards,</div> -->
                      <!-- <div>Innocent Mrema</div> -->
                    </div>
                  </div>
                </div>
                <!---->
              
                <div class="col-md-4 ng-star-inserted" style="">
                  <div  v-if="receivedData?.resolved!=null" class="box-detail">
                    <div class="font-weight-bold">Closed Date</div>
                    <div>{{ receivedData?.resolved | format() }}</div>
                  </div>
                  <div v-else class="box-detail">
                    <div class="font-weight-bold">Closed Date</div>
                    <div>{{ "--------------------"}}</div>
                  </div>
                </div>
                <!----><!---->
              </div>
            </div>
            <div class="col-md-4">
              <div class="right-aligned-text">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-if="receivedData?.status != 'Imejibiwa'"
                      @click="assignUser"
                      v-bind="attrs"
                      v-on="on"
                      class="ma-2 white--text"
                      fab
                      color="teal"
                    >
                      <v-icon dark> mdi-account-plus </v-icon>
                    </v-btn>
                  </template>
                  <span>Assign Attendant</span>
                </v-tooltip>
                <router-link to="/query">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        class="ma-2 white--text"
                        fab
                        color="primary"
                      >
                        <v-icon dark> mdi-arrow-left-circle </v-icon>
                      </v-btn>
                    </template>
                    <span>Back</span>
                  </v-tooltip>
                </router-link>
              </div>
              <v-card
                class="mat-card mat-focus-indicator shadow-sm mat-elevation-z3"
                ><p class="ng-star-inserted" style="">
                  <!----><span class="ng-star-inserted font-weight-bold pl-4"
                    >PROGRESS STATUS </span
                  ><!---->
                </p>
                <!---->
                <p class="resolved ng-star-inserted" style="">
                  <span class="pl-4">This Query is currently at status</span>
                  <br />
                  <v-btn text class="primaary--text" color="green"
                    >{{ receivedData?.status }}
                  </v-btn>
                </p>
                <p class="resolved ng-star-inserted" style=""></p>
                <!----><!----><!----><!----><!----><!----><!----></v-card
              >
            </div>
          </div>
          <!----><!---->
        </div>
      </v-card-text>

      <div
        v-if="receivedData && receivedData?.queryclaimattachments.length > 0"
        class="col-md-4"
      >
        <div class="box-detail">
          <div>Attached Documents</div>
        </div>
      </div>
      <v-container>
        <v-list dense>
          <v-list-item
            v-for="(file, index) in receivedData?.queryclaimattachments"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>mdi-attachment</v-icon>
                <em class="primary--text">{{ file }}</em></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { get, find, saveUserQuety } from "../user/services/user.service";
import { get as getQueryCategories } from "../setup/query-category/services/query-category.service";
import { get as getQueryPrioorities } from "../setup/query-priority/services/query-priority.service";



export default {
  data() {
    return {
      searchTerm: "",
      formData: {},
      receivedData: null,
      users: [],
      userList: false,
      title: "Query Details",
      queryCategories: [],
      queryPrioorities:[],
    };
  },

  methods: {
    Save() {
      saveUserQuety(this.formData);
      this.userList = false;
      this.$router.push({ name: "query" });
      // this.$emit("reloadData");
    },

    assignUser() {
      this.formData.queryId = this.receivedData.id;
      this.userList = true;
    },
    cancelConfirmDialog() {
      this.userList = false;
      this.users = [];
      this.searchTerm = "";
    },
    searchUser(item) {
      this.users = [];
      this.searchTerm = "";
      const regSearchTerm = item ? item : this.searchTerm;
      find({ regSearchTerm }).then((response) => {
        const allUsers = response.data;
        // Use .map() to add the full_name attribute to each user
        const usersWithFullName = allUsers.map((user) => {
          // Calculate the full_name based on your data structure
          const full_name = `${user.first_name} ${user.last_name} ${user.phone_number}`;
          // Return the user object with the added full_name attribute
          return { ...user, full_name };
        });
        // Use .filter() to remove any user objects with falsy values
        this.users = usersWithFullName.filter((user) => user);
      });
    },

    getCurrentUser() {
      return this.$store.getters["Auth/getCurrentUser"];
    },
  },
  mounted() {
    getQueryCategories({}).then((response) => {
      this.queryCategories = response.data;
    });

    getQueryPrioorities({}).then((response) => {
      this.queryPrioorities = response.data;
    });
    this.getCurrentUser();
    // this.usersX = this.getCurrentUser();
    // Parse the received JSON string back to an object
    this.receivedData = JSON.parse(this.$route.query.data);
  },
};
</script>
<style>
.right-aligned-text {
  text-align: right;
}

/* Applying underline to text */
.underline-text {
  text-decoration: underline; /* Add an underline */
}

/* Applying underline to other elements, like divs or spans */
.underline-element {
  border-bottom: 1px solid #000; /* Add a solid black underline */
}
</style>
