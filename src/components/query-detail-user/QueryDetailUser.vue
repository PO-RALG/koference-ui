<template>
  <div>
    <h2>{{ title }}</h2>
    <v-card>
      <!-- <Modal :modal="userList" :width="700">
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
      </Modal> -->
      <Modal :modal="userList" :width="1000" :fullScreen="true">
        <template v-slot:header>
          <ModalHeader
            :title="` Fill the form and submit to send the feedback to claimer `"
          />
        </template>
        <template v-slot:body>
          <ModalBody v-if="formData">
            <v-form ref="form" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12" class="mb-n8">
                    <v-col cols="12" md="12" class="mb-n8">
                      <v-textarea
                        outlined
                        name="input-7-4"
                        label="Andika Maelezo Hapa Chini"
                        v-model="formData.feedbackdescription"
                      ></v-textarea>
                    </v-col>

                    <!-- start -->
                    <v-row>
                      <v-card-text>
                        <v-row>
                          <v-col
                            v-for="item in documentTypes"
                            :key="item.id"
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <label for="file" class="label">
                              <small class="t-color">
                                {{ item.name }}{{ "___"
                                }}{{ "Kiambatanisho Kinachohusu" }}
                                {{ item.queryCategory.description }}
                              </small>
                            </label>
                            <v-file-input
                              @change="saveFile($event, item)"
                              v-model="item.file"
                              color=""
                              placeholder="chagua faili"
                              filled
                              outlined
                              :show-size="1000"
                            >
                            </v-file-input>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-row>
                    <!-- {{ data.documentTypes }} -->
                    <!-- end -->
                  </v-col>
                </v-row>
                <v-card-actions class="mt-12">
                  <ModalFooter>
                    <v-spacer></v-spacer>
                    <v-btn
                      @click="cancelConfirmDialog"
                      color="red lighten-2"
                      large
                      class="white--text"
                      >Cancel</v-btn
                    >
                    <v-btn
                      @click="submitFomrm"
                      color="green lighten-2"
                      class="white--text"
                      large
                      >{{ "Submit feedback" }}
                    </v-btn>
                  </ModalFooter>
                </v-card-actions>
              </v-container>
            </v-form>
          </ModalBody>
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
                    <div _ngcontent-byn-c280="">
                      {{ receivedDataz && receivedDataz?.tracknumber }}
                    </div>
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
                      {{ receivedDataz?.createdAt | format() }}
                    </div>
                  </div>
                </div>
                <div _ngcontent-byn-c280="" class="col-md-4">
                  <div _ngcontent-byn-c280="" class="box-detail">
                    <div _ngcontent-byn-c280="" class="font-weight-bold">
                      Issue Category
                    </div>
                    <div _ngcontent-byn-c280="">
                      {{ receivedDataz && receivedDataz.queryCategory?.name }}
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
                      v-if="receivedDataz && receivedDataz.user"
                      _ngcontent-byn-c280=""
                    >
                      {{ receivedDataz?.user.first_name }}
                      {{ " " }}
                      {{ receivedDataz?.user.first_name }}
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
                        {{ receivedDataz?.description }}
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
                    <div _ngcontent-byn-c280="">
                      {{ receivedDataz?.closeddAt | format() }}
                    </div>
                  </div>
                </div>
                <!----><!---->
              </div>
            </div>
            <div _ngcontent-byn-c280="" class="col-md-4">
              <div class="right-aligned-text">
                <v-tooltip
                  v-if="
                    receivedDataz && receivedDataz?.feedbackdescription === null
                  "
                  bottom
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="assignUser"
                      v-bind="attrs"
                      v-on="on"
                      class="ma-2 white--text"
                      fab
                      color="teal"
                    >
                      <v-icon dark> mdi-reply-circle </v-icon>
                    </v-btn>
                  </template>
                  <span>Reply Query</span>
                </v-tooltip>
                <router-link to="/queryuser">
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
                    >{{ receivedDataz && receivedDataz.queryStatus?.name }}
                  </v-btn>
                </p>
                <p
                  _ngcontent-byn-c280=""
                  class="resolved ng-star-inserted"
                  style=""
                ></p>
                <div
                  v-if="receivedDataz && receivedDataz?.feedbackdescription"
                  class="ribbon"
                >
                  <span>CLOSED</span>
                </div>

                <!----><!----><!----><!----><!----><!----><!----></v-card
              >
            </div>
          </div>
          <!----><!---->
        </div>
      </v-card-text>

      <div
        v-if="
          receivedDataz &&
          receivedDataz.claimAttachment &&
          receivedDataz.claimAttachment.length > 0
        "
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
            v-for="(file, index) in receivedDataz?.claimAttachment"
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
import { find, saveUserQuety } from "../user/services/user.service";
import { getDocumentTypeCategoryFeedback } from "../../components/setup/query-document_type/services/query-document_type.service";
import {
  uploadFile,
  sendFeedbackData,
} from "../../components/auth/services/index";
export default {
  name: "QueryDetailUser",
  data() {
    return {
      searchTerm: "",
      formData: {
        files: [],
      },
      receivedDataz: "",
      users: [],
      documentTypes: [],
      userList: false,
      title: "Query Details",
    };
  },

  methods: {
    submitFomrm() {
      sendFeedbackData(this.formData).then(() => {
        this.formData = {
          id: "",
          description: "",
          queryStatusId: null,
          queryCategoryId: "",
          files: [],
        };
        this.formData.files = [];
        this.documentTypes = [];
        this.userList = false;
        this.$router.push({ name: "anotheruser" });
      });
    },

    saveFile(file, item) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        uploadFile(formData).then((response) => {
          console.log("response:", response);
          const fileInfo = {
            file_path: response.data.current_name,
            queryDocumentTypeId: item.id,
          };
          console.log("path:", this.formData);
          this.formData.files.push(fileInfo);
          //remove duplicates but keep the last updated score!
          // data.formData.files.reverse();
          // data.formData.files = _.uniqBy(data.formData2, "current_name");
          // this.loading2 = false;
        });
      }
    },

    Save() {
      saveUserQuety(this.formData);
      this.userList = false;
      this.$router.push({ name: "anotheruser" });
    },
    assignUser() {
      this.formData.query = this.receivedDataz;
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
  },
  mounted() {
    this.receivedDataz = JSON.parse(this.$route.query.dataz);
    this.formData.description = this.receivedDataz.description;
    this.formData.queryCategoryId = this.receivedDataz.queryCategoryId;
    this.formData.userId = this.receivedDataz.userId;
    getDocumentTypeCategoryFeedback().then((response) => {
      console.log("response", response);
      this.documentTypes = response.data;
    });
  },
};
</script>
<style>
.right-aligned-text {
  text-align: right;
}
</style>
<style>
.box {
  width: 200px;
  height: 300px;
  position: relative;
  border: 1px solid #bbb;
  background: #eee;
}
.ribbon {
  position: absolute;
  right: -5px;
  top: -5px;
  z-index: 1;
  overflow: hidden;
  width: 95px;
  height: 95px;
  text-align: right;
}
.ribbon span {
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  text-align: center;
  line-height: 25px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  width: 100px;
  display: block;
  background: #79a70a;
  /* background: linear-gradient(#052c57 0%, #77bdec 100%); */
  box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  position: absolute;
  top: 19px;
  right: -21px;
}
.ribbon span::before {
  content: "";
  position: absolute;
  left: 0px;
  top: 100%;
  z-index: -1;
  border-left: 3px solid #79a70a;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #79a70a;
}
.ribbon span::after {
  content: "";
  position: absolute;
  right: 0px;
  top: 100%;
  z-index: -1;
  border-left: 3px solid transparent;
  border-right: 3px solid #79a70a;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #79a70a;
}
</style>
