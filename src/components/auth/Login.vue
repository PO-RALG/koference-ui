<template>
  <v-app
    justify-center
    class="grey lighten-3 pa-0 text-center main-body"
    fluid
    fill-height
  >
    <v-layout justify-center align-center class="body_bg">
      <v-main align="center" justify="center">
        <v-row align="center" justify="center">
          <v-col cols="8" sm="8" md="7">
            <!-- <v-row class="mb-0 pa-0" justify="center">
              <v-col md="auto">
                <v-flex class="col-md12">
                  <img :src="data.coat" class="login-logo" />
                  <v-row class="mb-0 pa-0" justify="center" no-gutters>
                    <h4 class="white--text">
                      <strong>
                        {{ "THE UNITED REPUBLIC OF TANZANIA" }}
                      </strong>
                    </h4>
                  </v-row>
                  <h4 class="white--text">
                    {{
                      "FACILITY FINANCIAL ACCOUNTING AND REPORTING SYSTEM (FFARS)"
                    }}
                  </h4>
                </v-flex>
              </v-col>
            </v-row> -->

            <v-card height="fit" class="elevation-8 pa-n16">
              <v-row
                dense
                class="mr-0 ml-0 mr-0 ml-0"
                v-if="data.slides.length > 0"
              >
                <!-- class="d-none d-md-flex d-lg-none d-none d-lg-flex d-xl-none d-none " -->
                <v-col
                  md="6"
                  cols="12"
                  sm="12"
                  class="d-none d-md-flex d-lg-none d-none d-lg-flex"
                >
                  <v-carousel
                    cycle
                    hide-delimiters
                    interval="10000"
                    height="100%"
                    light
                  >
                    <v-carousel-item
                      v-for="(item, i) in data.slides"
                      :key="i"
                      :src="item.src"
                    >
                    </v-carousel-item>
                  </v-carousel>
                </v-col>
                <!-- login form start -->
                <Modal :modal="data.modal" :width="1000" :fullScreen="true">
                  <template v-slot:header>
                    <ModalHeader
                      :title="`${data.modalTitle} Fomu ya Kutuma Malalamiko , Mapendekezo au Maoni Yako`"
                    />
                  </template>
                  <template v-slot:body>
                    <ModalBody v-if="data.formData">
                      <v-form ref="form" enctype="multipart/form-data">
                        <v-container>
                          <v-row>
                            <v-col cols="12" md="12" class="mb-n8">
                              <v-select
                                :items="data.queryCategories"
                                prepend-inner-icon="mdi-file-document-multiple"
                                label="Chagua aina ya wasilisho lako(Lalamiko)"
                                outlined
                                v-model="data.formData.queryCategoryId"
                                :item-text="'name'"
                                item-value="id"
                                @change="loadDocumentType"
                              >
                                <template v-slot:selection="{ item }">
                                  {{ item.name }}-{{ item.description }}
                                </template>
                                <template v-slot:item="{ item }">
                                  {{ item.name }} -{{ item.description }}
                                </template>
                              </v-select>

                              <v-col cols="12" md="12" class="mb-n8">
                                <v-textarea
                                  outlined
                                  v-if="data.formData.queryCategoryId"
                                  name="input-7-4"
                                  label="Andika Maelezo Hapa Chini"
                                  v-model="data.formData.description"
                                ></v-textarea>
                              </v-col>

                              <!-- start -->
                              <v-row>
                                <v-card-text>
                                  <v-row>
                                    <v-col
                                      v-for="item in data.documentTypes"
                                      :key="item.id"
                                      cols="12"
                                      sm="6"
                                      md="3"
                                    >
                                      <label for="file" class="label">
                                        <small class="t-color">
                                          {{ item.name }}
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
                          <v-card-actions
                            v-if="data.formData.queryCategoryId"
                            class="mt-12"
                          >
                            <ModalFooter>
                              <v-spacer></v-spacer>
                              <v-btn
                                @click="closeDialog"
                                color="red lighten-2"
                                large
                                >Ghairi Kutuma fomu</v-btn
                              >
                              <v-btn
                                @click="submitFomrm"
                                color="green lighten-2"
                                large
                                >{{ "Tuma fomu yako" }}
                              </v-btn>
                            </ModalFooter>
                          </v-card-actions>
                        </v-container>
                      </v-form>
                    </ModalBody>
                  </template>
                </Modal>
                <v-col md="6" cols="12" sm="12">
                  <!-- <v-col cols="12" md="4" sm="12"> -->
                  <v-card-text class>
                    <v-row class="mb-0 pa-0" justify="center" no-gutters>
                      <img :src="data.ffars_logo" class="ffars-logo" />
                    </v-row>
                    <h2 class="text-center pa-3 login-header" color="primary">
                      LOGIN to your account
                    </h2>
                    <!-- <v-row class="mb-0 pa-0" justify="center" no-gutters>
                      <h4 class="siteName pa-0 pb-4">({{ data.siteName }})</h4>
                    </v-row> -->
                    <v-form
                      ref="form"
                      v-model="data.valid"
                      @submit.prevent="loginUser"
                    >
                      <v-text-field
                        prepend-inner-icon="mdi-account-box"
                        label="username"
                        v-model="data.username"
                        required
                        outlined
                        class="mr-3 ml-3"
                      ></v-text-field>

                      <v-text-field
                        prepend-inner-icon="mdi-key-variant"
                        label="Password"
                        v-model="data.password"
                        v-bind:rules="data.passwordRules"
                        v-bind:type="'password'"
                        required
                        outlined
                        class="mr-3 ml-3"
                      ></v-text-field>
                      <v-card-actions class="mr-1 ml-0 mt-n4">
                        <!-- <v-btn
                          x-small
                          class="mx-2 d-none d-sm-flex ml-0"
                          fab
                          outlined
                          dark
                          color="primary"
                        >
                          <a href="http://196.192.73.13/docs" target="_blank">
                            <v-icon small color="primary">mdi-help</v-icon>
                          </a>
                        </v-btn> -->
                        <v-btn
                          @click="openClaimForm"
                          color="#19577b"
                          class="white--text"
                          :loading="data.loading"
                        >
                          <v-icon large left>mdi-cloud-upload</v-icon>Wasilisha
                          lalamiko
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="#19577b"
                          class="white--text"
                          type="submit"
                          :disabled="!data.valid || data.loading"
                          :loading="data.loading"
                        >
                          <v-icon left>mdi-login</v-icon>LOGIN
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card-text>
                </v-col>
                <!-- login form end -->
              </v-row>
            </v-card>

            <div class="pt-5">
              <v-row class="mb-6 pa-0" justify="center" no-gutters>
                <small class="white--text">
                  {{ "Copyright" }}
                </small>
                <small class="white--text">
                  {{ " ©2022 PORALG" }}
                </small>
                <small class="white--text">
                  {{ ". All right reserved." }}
                </small>
                <small class="white--text">
                  <strong>{{ " FFARS v2.0 ." }}</strong>
                </small>
                <small class="white--text">
                  {{
                    "For any Technical inquiry, please contact your ICT Support Team ."
                  }}
                </small>
              </v-row>
              <v-row class="mb-n8 pa-0" justify="center" no-gutters> </v-row>
            </div>
          </v-col>
          <v-col cols="8" sm="8" md="7">
            <div class="text-center"></div>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { reactive, onMounted } from "vue";
import {
  authenticate,
  setUser,
  uploadFile,
  createData,
  getAppName,
  setAppName,
} from "./services";
import { AxiosResponse } from "axios";
import router from "@/router";
import { get as getQueryCategories } from "../../components/setup/query-category/services/query-category.service";
import { getDocumentTypeCategory } from "../../components/setup/query-document_type/services/query-document_type.service";
import _ from "lodash";

export default Vue.extend({
  props: ["source", "query"],

  setup(props) {
    const query = props.query;

    let data = reactive({
      modal: false,
      model: 0,
      modalTitle: "",
      siteName: "",
      valid: true,
      showInfo: true,
      errorMessage: "",
      loading: false,
      logo: "/brand.png",
      ffars_logo: "/ffars_logo.png",
      coat: "/coat_of_arms.svg.png",
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
      slides: [{ src: "/V.jpg" }],
      username: "",
      queryCategories: [],
      documentTypes: [],
      emailRules: [
        (v: any) => !!v || "username is required",
        (v: any) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be a valid username",
      ],
      password: "",
      passwordRules: [(v: any) => !!v || "Password is required"],
      formData: {
        id: "",
        description: "",
        queryStatusId: 1,
        queryCategoryId: "",
        files: [],
      },
    });

    onMounted(() => {
      getQueryCategories({}).then((response: any) => {
        data.queryCategories = response.data;
      });
      // getAppName().then((response) => {
      //   setAppName(response.data.data);
      //   data.siteName = response.data.data;
      // });
    });

    const openClaimForm = () => {
      data.modal = true;
    };
    const closeDialog = () => {
      data.modal = false;
    };

    const submitFomrm = () => {
      if (data.formData.id) {
        // updateQueryCategory(data.formData);
      } else {
        createData(data.formData).then(() => {
          data.modal = false;
          data.formData = {
            id: "",
            description: "",
            queryStatusId: 1,
            queryCategoryId: "",
            files: [],
          };
          data.formData.files = [];
          data.documentTypes = [];
        });
      }
    };

    const saveFile = (file, item) => {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        uploadFile(formData).then((response) => {
          console.log("response:", response);
          const fileInfo = {
            file_path: response.data.current_name,
            queryDocumentTypeId: item.id,
          };
          console.log("path:", data.formData);
          data.formData.files.push(fileInfo);
          //remove duplicates but keep the last updated score!
          // data.formData.files.reverse();
          // data.formData.files = _.uniqBy(data.formData2, "current_name");
          // this.loading2 = false;
        });
      }
    };

    const loadDocumentType = (e) => {
      getDocumentTypeCategory(e).then((response: any) => {
        console.log("response", response);
        data.documentTypes = response.data;
      });
    };

    const loginUser = () => {
      const payload = {
        username: data.username,
        password: data.password,
      };

      authenticate(payload).then((response: AxiosResponse) => {
        let redirectUrl = query["redirect"] || "/";
        // console.log("res", response.status);
        if (response.status === 201) {
          // console.log("res", response.data.msg);
          // if (response.data.msg) {
          setUser(response);
          router.push(redirectUrl);
        } else {
          router.push("/login");
        }
      });
    };

    return {
      openClaimForm,
      loadDocumentType,
      loginUser,
      getDocumentTypeCategory,
      data,
      saveFile,
      closeDialog,
      submitFomrm,
    };
  },
});
</script>

<style scoped>
.coat {
  width: 100px;
  height: 100px;
}
.main-body {
  background: #ccc !important;
}
.body_bg {
  /* background-image: url("@/assets/ffars_background.jpg") !important; */
  /* background-color: #054c97; */
  background-color: #ffffff;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center center !important; /* optional, center the image */
}
.v-responsive__sizer {
  padding-bottom: 85% !important;
}
.wrapper {
  padding: 0 !important;
}
.img_top {
  border-style: none;
  height: 60px;
  padding-bottom: 5px;
}
.img_slides {
  height: inherit;
  width: inherit;
}
.bdt {
  border-top: solid 5px #1476d7;
}

.bdw {
  border-bottom: solid 2px #1476d7;
}
.login-logo {
  border-radius: 50%;
  height: 100px;
  width: 100px;
  border: 4px solid #ccc;
  background-color: white;
}
.ffars-logo {
  height: 60%;
  width: 80%;
}
.login-header {
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
}
.v-sheet {
  padding: 10px;
}
h4.siteName {
  text-transform: uppercase;
  color: red;
  font-weight: bold;
}
a {
  text-decoration: none;
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
  width: 75px;
  height: 75px;
  text-align: right;
}
.ribbon span {
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  text-align: center;
  line-height: 20px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  width: 100px;
  display: block;
  background: #79a70a;
  background: linear-gradient(#052c57 0%, #77bdec 100%);
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
