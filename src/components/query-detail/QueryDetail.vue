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
                v-model="formData.user_id"
                :items="users"
                item-value="id"
                item-text="first_name"
                label="Select user"
                outlined
                required
              >
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
          </ModalBody>
        </template>
        <template v-slot:footer>
          <ModalFooter>
            <v-btn color="green darken-1" text @click="cancelConfirmDialog"
              >Cancel</v-btn
            >
            <v-btn color="red darken-1" @click="Save" text>Yes</v-btn>
          </ModalFooter>
        </template>
      </Modal>
      <v-card-text>
        <div _ngcontent-byn-c280="" class="white-box">
          <div _ngcontent-byn-c280="" class="row">
            <div _ngcontent-byn-c280="" class="col-md-8">
              <div _ngcontent-byn-c280="" class="row DetailsDiv">
                <div _ngcontent-byn-c280="" class="col-md-12">
                  <div
                    _ngcontent-byn-c280=""
                    class="sub-header py-2 d-flex flex-row justify-content-between"
                  >
                    <span _ngcontent-byn-c280="" class="time-age">
                      Age: 0d, 3h, 18m &nbsp;&nbsp;
                      <!----></span
                    >
                    <!-- <span
                      _ngcontent-byn-c280=""
                      class="time-till-resolved ng-star-inserted"
                      style=""
                    >
                      &nbsp;&nbsp; Time until resolved: (0d, 3h, 18m) </span
                    > -->
                    <!----><mat-divider
                      _ngcontent-byn-c280=""
                      role="separator"
                      class="mat-divider mat-divider-horizontal"
                      aria-orientation="horizontal"
                    ></mat-divider>
                  </div>
                </div>
                <div _ngcontent-byn-c280="" class="col-md-4">
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Title
                    </div>
                    <div _ngcontent-byn-c280="">GMS CODE REQUEST</div>
                  </div>
                </div>
                <div _ngcontent-byn-c280="" class="col-md-4">
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Track Number
                    </div>
                    <div _ngcontent-byn-c280="">MSIMBAZI-230917-0011</div>
                  </div>
                </div>
                <div
                  _ngcontent-byn-c280=""
                  class="col-md-4 ng-star-inserted"
                  style=""
                >
                  <!---->
                  <div
                    _ngcontent-byn-c280=""
                    class="box-detail ng-star-inserted"
                  >
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Reported to
                    </div>
                    <div _ngcontent-byn-c280="">Msimbazi Basin</div>
                  </div>
                  <!---->
                </div>
                <!----><!----><!---->

                <div _ngcontent-byn-c280="" class="col-md-4 ng-star-inserted">
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Reported Via
                    </div>
                    <div _ngcontent-byn-c280="">Website</div>
                  </div>
                </div>
                <!----><!---->
                <div _ngcontent-byn-c280="" class="col-md-4">
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Incidence Origin
                    </div>
                    <div _ngcontent-byn-c280="">EXTERNAL</div>
                  </div>
                </div>
                <div _ngcontent-byn-c280="" class="col-md-4">
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Submission Date
                    </div>
                    <div _ngcontent-byn-c280="">
                      {{ receivedData?.createdAt | format() }}
                    </div>
                  </div>
                </div>
                <div _ngcontent-byn-c280="" class="col-md-4">
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Issue Category
                    </div>
                    <div _ngcontent-byn-c280="">
                      {{ receivedData && receivedData.queryCategory?.name }}
                    </div>
                  </div>
                </div>
                <div
                  _ngcontent-byn-c280=""
                  class="col-md-4 ng-star-inserted"
                  style=""
                >
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Issue Title
                    </div>
                    <div _ngcontent-byn-c280="">Query Submition</div>
                  </div>
                </div>
                <!---->

                <div
                  _ngcontent-byn-c280=""
                  class="col-md-4 ng-star-inserted"
                  style=""
                >
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Priortiy
                    </div>
                    <div _ngcontent-byn-c280="">High</div>
                  </div>
                </div>
                <!---->
                <div
                  _ngcontent-byn-c280=""
                  class="col-md-4 ng-star-inserted"
                  style=""
                >
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Assigned To
                    </div>
                    <div
                      v-if="receivedData && receivedData.user"
                      _ngcontent-byn-c280=""
                    >
                      {{ receivedData?.user.first_name }}
                      {{ " " }}
                      {{ receivedData?.user.first_name }}
                    </div>
                    <div v-else _ngcontent-byn-c280="">
                      {{ "___________" }}
                    </div>
                  </div>
                </div>
                <!----><!----><!----><!----><!----><!---->
                <div _ngcontent-byn-c280="" class="col-md-12">
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Description
                    </div>
                    <div _ngcontent-byn-c280="">
                      <!-- hello, -->
                      <div>
                        {{ receivedData?.description }}
                      </div>
                      <div><br /></div>
                      <!-- <div>Best Regards,</div> -->
                      <!-- <div>Innocent Mrema</div> -->
                    </div>
                  </div>
                </div>
                <!---->
                <div
                  _ngcontent-byn-c280=""
                  class="col-md-4 ng-star-inserted"
                  style=""
                >
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Resolved Date
                    </div>
                    <div _ngcontent-byn-c280="">Sep 17, 2023 @ 21:21:58</div>
                  </div>
                </div>
                <div
                  _ngcontent-byn-c280=""
                  class="col-md-4 ng-star-inserted"
                  style=""
                >
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Closed Date
                    </div>
                    <div _ngcontent-byn-c280="">{{ "____________" }}</div>
                  </div>
                </div>
                <!----><!---->
              </div>
            </div>
            <div _ngcontent-byn-c280="" class="col-md-4">
              <div class="right-aligned-text">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
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
                _ngcontent-byn-c280=""
                class="mat-card mat-focus-indicator shadow-sm mat-elevation-z3"
                ><p _ngcontent-byn-c280="" class="ng-star-inserted" style="">
                  <!----><span
                    _ngcontent-byn-c280=""
                    class="ng-star-inserted font-weight-bold pl-4"
                    >PROGRESS STATUS </span
                  ><!---->
                </p>
                <!---->
                <p
                  _ngcontent-byn-c280=""
                  class="resolved ng-star-inserted"
                  style=""
                >
                  <span class="pl-4">This Query is currently at status</span>
                  <br _ngcontent-byn-c280="" />
                  <v-btn text class="primaary--text" color="green"
                    >{{ receivedData && receivedData.queryStatus?.name }}
                  </v-btn>
                </p>
                <p
                  _ngcontent-byn-c280=""
                  class="resolved ng-star-inserted"
                  style=""
                ></p>
                <!----><!----><!----><!----><!----><!----><!----></v-card
              >
            </div>
          </div>
          <!----><!---->
        </div>
      </v-card-text>

      <div
        v-if="receivedData && receivedData.claimAttachment.length > 0"
        class="col-md-4"
      >
        <div _ngcontent-byn-c280="" class="box-detail">
          <div _ngcontent-byn-c280="">Attached Documents</div>
        </div>
      </div>
      <v-container>
        <v-list dense>
          <!-- Loop through your list of files and display them -->
          <v-list-item
            v-for="(file, index) in receivedData?.claimAttachment"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>mdi-attachment</v-icon>
                <em class="primary--text">{{
                  file.queryDocumentType?.name
                }}</em></v-list-item-title
              >
            </v-list-item-content>
            <!-- You can add additional elements/buttons here related to each file -->
          </v-list-item>
        </v-list>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { get, find, saveUserQuety } from "../user/services/user.service";
export default {
  data() {
    return {
      searchTerm: "",
      formData: {},
      receivedData: null,
      users: [],
      userList: false,
      title: "Query Details",
    };
  },

  methods: {
    Save() {
      saveUserQuety(this.formData);
      this.userList = false;
      this.$router.push({ name: "query" });
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
        for (let i = 0; i < allUsers.length; i++) {
          const element = allUsers[i];
          if (element) {
            this.users.push(element);
          }
        }
      });
    },
    getCurrentUser() {
      return this.$store.getters["Auth/getCurrentUser"];
    },
  },
  mounted() {
    this.getCurrentUser();
    this.usersX = this.getCurrentUser();
    // Parse the received JSON string back to an object
    this.receivedData = JSON.parse(this.$route.query.data);
  },
};
</script>
<style>
.right-aligned-text {
  text-align: right;
}
</style>
