<template>
  <v-app
    justify-center
    class="grey lighten-3 pa-0 text-center main-body"
    fluid
    fill-height
  >
    <v-layout justify-center align-center class="landing-page-background">
      <!-- App Bar -->
      <v-app-bar color="#19577b" app>
        <v-toolbar-title class="custom-title white--text"
          >MRADI WA BONDE LA MTO MSIMBAZI (MSIMBAZI BASIN PROJECT)
          (GRM-SYSTEM)</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn class="white--text" @click="openClaimForm" text
          >Tuma Shauri (Query Submition)</v-btn
        >
        <v-btn class="white--text" text @click="searchQuery"
          >Fuatlia (Query Tracking)</v-btn
        >
        <v-btn class="white--text" @click="openLogin" text>Ingia (Login)</v-btn>
      </v-app-bar>
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
            <Modal :modal="data.modal" :width="1000" :fullScreen="true">
              <template v-slot:header>
                <ModalHeader
                  :title="`${data.modalTitle} Tuma Malalamiko , Ushauri au Maoni Yako`"
                  :is_signup="true"
                  :is_known="data.selectedOption"
                  :is_claiming="true"
                  @closeDialog="closeDialog"
                  @openSignUp="openSignUp"
                />
              </template>
              <template v-slot:body>
                <v-container class="d-flex justify-center align-center">
                  <v-radio-group
                    row
                    v-model="data.selectedOption"
                    @change="reloadForm"
                  >
                    <v-radio
                      label="Tuma kwa kutambulika(Known)"
                      value="known"
                    ></v-radio>
                    <v-radio
                      label="Tuma kwa kutotambulika(Anonymous)"
                      value="anonymous"
                    ></v-radio>
                  </v-radio-group>
                </v-container>
                <v-container class="d-flex justify-center align-center">
                  <v-col cols="12" md="7" class="mt-n3">
                    <v-alert
                      v-if="data.selectedOption === 'known'"
                      border="bottom"
                      colored-border
                      type="warning"
                      elevation="2"
                    >
                      Ili uweze kutuma ujumbe wako kwa kutambulika
                      <span class="font-weight-bold"
                        >hakikisha
                        <span
                          class="show-hand text-decoration-underline primary--text"
                          @click="openSignUp"
                          ><em>umejisajili</em></span
                        >
                      </span>
                      na umetambulika kwa kuingiza
                      <span class="font-weight-bold"
                        >namba yako ya utambuzi hapa chini.
                      </span>
                      <p>
                        <span class="font-weight-bold warning--text"
                          >KUMBUKA:</span
                        >
                        <span
                          >Namba yako ya utambuzi
                          <span class="error--text font-weight-bold"
                            >ni siri yako</span
                          >
                          na itatumwa kwenye baruapepe utakayojaza wakati wa
                          kujisajili.</span
                        >
                      </p>
                      <p></p>
                    </v-alert>
                  </v-col>
                </v-container>
                <v-container class="d-flex justify-center align-center">
                  <v-col cols="12" md="7" class="mt-n3">
                    <v-text-field
                      v-if="data.selectedOption === 'known'"
                      v-model="data.searchUser"
                      append-icon="mdi-magnify"
                      label="Weka namba ya utambuzi"
                      placeholder="Weka namba ya utambuzi(Identification number)"
                      solo-inverted
                      clearable
                      @click:append="trackUser(data.searchUser)"
                      :disabled="data.retrivedUserToBind"
                    ></v-text-field>
                  </v-col>
                </v-container>
                <v-container
                  v-if="data.retrivedUserToBind"
                  class="d-flex justify-center align-center"
                >
                  Umetambulika kwa majina:
                  <span class="font-weight-bold text-uppercase">
                    {{ data?.retrivedUserToBind?.first_name }} {{ " " }}
                    {{ data?.retrivedUserToBind?.last_name }}</span
                  >
                </v-container>
                <ModalBody v-if="data.formData">
                  <v-form
                    v-if="data.selectedOption === 'anonymous'"
                    ref="form"
                    enctype="multipart/form-data"
                  >
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="12" class="mb-n8">
                          <v-select
                            :items="data.queryCategories"
                            prepend-inner-icon="mdi-file-document-multiple"
                            label="Chaguax aina ya wasilisho lako(Lalamiko)"
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
                          <v-btn
                            v-if="data.formData.queryCategoryId"
                            @click="submitFomrm"
                            color="green lighten-2"
                            large
                            class="white--text"
                            >{{ "Tuma" }}
                          </v-btn>
                          <!-- {{ data.documentTypes }} -->
                          <!-- end -->
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                  <v-form
                    v-if="data.retrivedUser.length > 0"
                    ref="form"
                    enctype="multipart/form-data"
                  >
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="12" class="mb-n8">
                          <v-select
                            v-if="data.retrivedUserToBind != null"
                            :items="data.queryCategories"
                            prepend-inner-icon="mdi-file-document-multiple"
                            label="Chagua aina ya wasilisho lako(Lalamiko)"
                            outlined
                            v-model="data.formData.queryCategoryId"
                            :item-text="'name'"
                            item-value="id"
                            @change="loadDocumentTypeSetKnown"
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
                          <v-btn
                            v-if="data.formData.queryCategoryId"
                            @click="submitFomrm"
                            color="green lighten-2"
                            large
                            class="white--text"
                            >{{ "Tuma" }}
                          </v-btn>
                          <!-- {{ data.documentTypes }} -->
                          <!-- end -->
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </ModalBody>
                <ModalFooter> <v-spacer></v-spacer> </ModalFooter>
              </template>
            </Modal>

            <Modal :modal="data.modalLogin" :width="840" :fullScreen="false">
              <template v-slot:header>
                <ModalHeader :title="`${data.modalTitle} Login Form`" />
              </template>
              <template v-slot:body>
                <ModalBody v-if="data.formData">
                  <v-card height="fit" class="elevation-0 pa-n16">
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

                      <v-col md="6" cols="12" sm="12">
                        <!-- <v-col cols="12" md="4" sm="12"> -->
                        <v-card-text class>
                          <v-row class="mb-0 pa-0" justify="center" no-gutters>
                            <img :src="data.ffars_logo" class="ffars-logo" />
                          </v-row>
                          <h2
                            class="text-center pa-3 login-header"
                            color="primary"
                          >
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
                                @click="closeDialogLogin"
                                color="red lighten-2"
                                class="white--text"
                                :loading="data.loading"
                              >
                                <v-icon large left>mdi-close</v-icon>Close
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
                </ModalBody>
              </template>
            </Modal>

            <Modal :modal="data.searchQuery" :fullScreen="true" :width="9000">
              <template v-slot:header>
                <ModalHeader
                  :is_claiming="true"
                  :title="`Ufuatiliaji (Query Tracking)`"
                  @closeDialog="closeDialog"
                />
              </template>
              <template v-slot:body>
                <ModalBody>
                  <v-container class="d-flex justify-center align-center">
                    <v-col cols="12" md="12" class="mt-n0">
                      <v-text-field
                        v-model="data.searchTerm"
                        append-icon="mdi-magnify"
                        label="Weka namba ya ufuatiliaji"
                        placeholder="Weka namba ya ufuatiliaji(Enter tracking number)"
                        solo-inverted
                        clearable
                        @click:append="trackQuery(data.searchTerm)"
                      ></v-text-field>
                    </v-col>
                  </v-container>
                  <!-- start -->
                  <div v-if="data.retrivedQuery">
                    <v-card>
                      <v-card-text>
                        <div _ngcontent-byn-c280="" class="white-box">
                          <div _ngcontent-byn-c280="" class="row">
                            <div _ngcontent-byn-c280="" class="col-md-8">
                              <div
                                _ngcontent-byn-c280=""
                                class="row DetailsDiv"
                              >
                                <div _ngcontent-byn-c280="" class="col-md-12">
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="sub-header py-2 d-flex flex-row justify-content-between"
                                  >
                                    <span
                                      _ngcontent-byn-c280=""
                                      class="time-age"
                                    >
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
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Title
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      GRM CODE REQUEST
                                    </div>
                                  </div>
                                </div>
                                <div _ngcontent-byn-c280="" class="col-md-4">
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Track Number
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      {{ data.retrivedQuery.tracknumber }}
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
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Reported to
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      Msimbazi Basin
                                    </div>
                                  </div>
                                  <!---->
                                </div>
                                <!----><!----><!---->

                                <div
                                  _ngcontent-byn-c280=""
                                  class="col-md-4 ng-star-inserted"
                                >
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Reported Via
                                    </div>
                                    <div _ngcontent-byn-c280="">Website</div>
                                  </div>
                                </div>
                                <!----><!---->
                                <div _ngcontent-byn-c280="" class="col-md-4">
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Incidence Origin
                                    </div>
                                    <div _ngcontent-byn-c280="">EXTERNAL</div>
                                  </div>
                                </div>
                                <div _ngcontent-byn-c280="" class="col-md-4">
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Submission Date
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      {{ "VVVV" }}
                                    </div>
                                  </div>
                                </div>
                                <div _ngcontent-byn-c280="" class="col-md-4">
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Issue Category
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      {{
                                        data.retrivedQuery &&
                                        data.retrivedQuery.queryCategory &&
                                        data.retrivedQuery.queryCategory?.name
                                      }}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  _ngcontent-byn-c280=""
                                  class="col-md-4 ng-star-inserted"
                                  style=""
                                >
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Issue Title
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      Query Submition
                                    </div>
                                  </div>
                                </div>
                                <!---->

                                <div
                                  _ngcontent-byn-c280=""
                                  class="col-md-4 ng-star-inserted"
                                  style=""
                                >
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
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
                                ></div>
                                <!----><!----><!----><!----><!----><!---->
                                <div _ngcontent-byn-c280="" class="col-md-12">
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Description
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      <!-- hello, -->
                                      <div>
                                        {{
                                          data.retrivedQuery.feedbackdescription
                                        }}
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
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Resolved Date
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      Sep 17, 2023 @ 21:21:58
                                    </div>
                                  </div>
                                </div>
                                <div
                                  _ngcontent-byn-c280=""
                                  class="col-md-4 ng-star-inserted"
                                  style=""
                                >
                                  <div
                                    _ngcontent-byn-c280=""
                                    class="box-detail"
                                  >
                                    <div
                                      _ngcontent-byn-c280=""
                                      class="font-weight-bold"
                                    >
                                      Closed Date
                                    </div>
                                    <div _ngcontent-byn-c280="">
                                      {{ "____________" }}
                                    </div>
                                  </div>
                                </div>
                                <!----><!---->
                              </div>
                            </div>
                            <div _ngcontent-byn-c280="" class="col-md-4">
                              <v-card
                                _ngcontent-byn-c280=""
                                class="mat-card mat-focus-indicator shadow-sm mat-elevation-z3"
                                ><p
                                  _ngcontent-byn-c280=""
                                  class="ng-star-inserted"
                                  style=""
                                >
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
                                  <span class="pl-4"
                                    >Hatua lilipofikia shauri</span
                                  >
                                  <br _ngcontent-byn-c280="" />
                                  <v-btn
                                    text
                                    class="primaary--text"
                                    color="green"
                                    >{{
                                      data.retrivedQuery &&
                                      data.retrivedQuery.queryStatus &&
                                      data.retrivedQuery.queryStatus?.name
                                    }}
                                  </v-btn>
                                </p>
                                <p
                                  _ngcontent-byn-c280=""
                                  class="resolved ng-star-inserted"
                                  style=""
                                ></p>
                                <div
                                  v-if="
                                    data.retrivedQuery &&
                                    data.retrivedQuery?.feedbackdescription
                                  "
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

                      <div class="col-md-4">
                        <div _ngcontent-byn-c280="" class="box-detail">
                          <div _ngcontent-byn-c280="">Attached Documents</div>
                        </div>
                      </div>
                      <v-container>
                        <v-list dense>
                          <!-- Loop through your list of files and display them -->
                          <v-list-item
                            v-for="(file, index) in data.retrivedQuery
                              .feedbackAttachment"
                            :key="index"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-icon>mdi-attachment</v-icon>
                                <em
                                  @click="getFile(file.file_name)"
                                  class="primary--text"
                                  >{{ file.queryDocumentType?.name }}{{ "-"
                                  }}{{ file.file_name }}</em
                                ></v-list-item-title
                              >
                            </v-list-item-content>
                            <!-- You can add additional elements/buttons here related to each file -->
                          </v-list-item>
                        </v-list>
                      </v-container>
                    </v-card>
                  </div>
                  <!-- end -->
                </ModalBody>
              </template>
              <template v-slot:footer>
                <ModalFooter>
                  <!-- <v-btn @click="closeSearchQuery" color="green darken-1" text
                    >Funga</v-btn
                  > -->
                  <!-- <v-btn
                    @click="trackQuery(data.searchTerm)"
                    color="red darken-1"
                    text
                    >Tafuta</v-btn
                  > -->
                </ModalFooter>
              </template>
            </Modal>

            <div class="pt-5">
              <v-row class="mb-6 pa-0" justify="center" no-gutters>
                <small class="white--text">
                  {{ "Copyright" }}
                </small>
                <small class="white--text">
                  {{ " ©2022 MSIMBAZI BASIN" }}
                </small>
                <small class="white--text">
                  {{ ". All right reserved." }}
                </small>
                <small class="white--text">
                  <strong>{{ " GRM v1.0 ." }}</strong>
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
        <UserForm
          :isClaim="true"
          :isOpen="data.userModal"
          :title="data.modalTitle"
          :formData="data.formData"
          @onSubmit="save"
          @onClose="cancelDialog"
        />
        <FilePreview
          :filePrevieModel="data.filePreviewmodal"
          :toopen="data.toopen"
          @closeFilePreview="closeFilePreview"
        />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import UserForm from "../../components/user/forms/UserForm.vue";
import FilePreview from "./FilePreview.vue";
import Vue from "vue";
import { reactive, onMounted } from "vue";
import {
  authenticate,
  setUser,
  uploadFile,
  createData,
  openFile,
  // getAppName,
  // setAppName,
} from "./services";
import { AxiosResponse } from "axios";
import router from "@/router";
import {
  trackOneQuery,
  trackOneUser,
} from "../../components/query/services/query.service";
import { get as getQueryCategories } from "../setup/query-category/services/query-category.service";
import { getDocumentTypeCategory } from "../setup/query-document_type/services/query-document_type.service";
import _ from "lodash";
import { User } from "../../components/user/types/User";
import {
  create,
  sendMail,
  sendMailForSubmition,
} from "../../components/user/services/user.service";

export default Vue.extend({
  name: "LoginComponent",

  components: {
    UserForm,
    FilePreview,
  },
  props: ["source", "query"],

  setup(props) {
    const query = props.query;

    let data = reactive({
      filePreviewmodal: false,
      isClaim: false,
      toopen: "",
      retrivedUserToBind: null,
      searchUser: "",
      selectedOption: "known",
      searchTerm: "",
      searchQuery: false,
      userModal: false,
      modal: false,
      modalLogin: false,
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
        queryof_user_id: null,
        usersource: "",
      },
      retrivedQuery: "",
      retrivedUser: "",
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

    const previewFiles = (response: any) => {
      data.toopen = response;
      // window.open(response.data, "_blank");
      console.log("path", response);
      cancelDialog();
    };
    // const previewFiles = (response: any) => {
    //   const fileInfo = response.data;
    //   const fileUrl = `${fileInfo}`;
    //   data.toopen = fileUrl;
    //   // window.open(response.data, "_blank");
    //   console.log("path", fileUrl);
    //   cancelDialog();
    // };
    const closeFilePreview = () => {
      data.filePreviewmodal = false;
    };

    const getFile = (path: any) => {
      const dataz = {
        path: path,
      };
      data.filePreviewmodal = true;
      previewFiles(path);
      // openFile(dataz).then((response: AxiosResponse) => {
      //   if (response.status === 200 || response.status === 201) {
      //     previewFiles(response);
      //   }
      // });

      // Corrected code
      // let modalState = {
      //   fileUrl: 'ddfebc03-de02-48dd-8390-b8668aead8ba.png',
      //   filePreviewModal: true, // Use an object to manage modal states
      // };
    };
    const createUser = (data: User) => {
      create(data).then((response: AxiosResponse) => {
        if (response.status === 200 || response.status === 201) {
          console.log("registered", response.data);
          sendMail(response.data);
          cancelDialog();
        }
      });
    };
    const save = (formData: any) => {
      if (formData.id) {
        delete formData.menus;
        delete formData.fullName;
        delete formData.files;
        delete formData.id;
        delete formData.queryof_user_id;
        // updateUser(formData);
      } else {
        delete formData.menus;
        delete formData.fullName;
        delete formData.files;
        delete formData.id;
        delete formData.queryof_user_id;
        createUser(formData);
      }
    };

    const cancelDialog = () => {
      // data.formData = {} as User;
      data.formData = {} as any;
      data.userModal = false;
    };
    const trackQuery = (item: any) => {
      // data.searchTerm = "";
      const regSearchTerm = item ? item : data.searchTerm;
      trackOneQuery({ regSearchTerm }).then((response) => {
        data.retrivedQuery = response.data;
      });
    };
    const trackUser = (item: any) => {
      // data.searchTerm = "";
      const regSearchTerm = item ? item : data.searchUser;
      trackOneUser({ regSearchTerm }).then((response) => {
        data.retrivedUser = response.data;
        data.retrivedUserToBind = response.data[0];
        data.formData.queryof_user_id = response.data[0].id;
      });
    };

    const reloadForm = () => {
      data.documentTypes = [];
      data.searchTerm = "";
      data.retrivedQuery = "";
      data.retrivedUser = "";
      data.searchUser = "";
      data.retrivedUserToBind = null;
      data.formData = {
        id: "",
        description: "",
        queryof_user_id: null,
        queryStatusId: 1,
        queryCategoryId: "",
        files: [],
        usersource: "",
      };
    };
    const closeSearchQuery = () => {
      data.searchQuery = false;
      data.searchTerm = "";
      data.retrivedQuery = "";
    };
    const openClaimForm = () => {
      data.modal = true;
    };
    const openLogin = () => {
      data.modalLogin = true;
    };
    const searchQuery = () => {
      data.searchQuery = true;
    };
    const closeDialog = () => {
      (data.retrivedUserToBind = null), (data.modal = false);
      data.searchQuery = false;
      (data.searchUser = ""),
        (data.formData = {
          id: "",
          description: "",
          queryof_user_id: null,
          queryStatusId: 1,
          queryCategoryId: "",
          files: [],
          usersource: "",
        });
      data.formData.files = [];
      data.documentTypes = [];
      data.retrivedQuery = "";
      data.searchTerm = "";
    };

    const openSignUp = () => {
      data.userModal = true;
      // data.modal = false;
      // data.searchQuery = false;

      // data.formData = {
      //   id: "",
      //   description: "",
      //   queryof_user_id: null,
      //   queryStatusId: 1,
      //   queryCategoryId: "",
      //   files: [],
      // };
      // data.formData.files = [];
      // data.documentTypes = [];
      // data.retrivedQuery = "";
      // data.searchTerm = "";
    };
    const closeDialogLogin = () => {
      data.modalLogin = false;
    };

    const submitFomrm = () => {
      if (data.formData.id) {
        // updateQueryCategory(data.formData);
      } else {
        createData(data.formData).then((response) => {
          data.modal = false;
          data.formData = {
            id: "",
            description: "",
            queryof_user_id: null,
            queryStatusId: 1,
            queryCategoryId: "",
            files: [],
            usersource: "",
          };
          data.formData.files = [];
          data.documentTypes = [];
          // console.log("response:", response);
          data.retrivedUserToBind.query = response.data;
          sendMailForSubmition(data.retrivedUserToBind);
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
        data.formData.usersource = "Anonymous";
      });
    };
    const loadDocumentTypeSetKnown = (e) => {
      getDocumentTypeCategory(e).then((response: any) => {
        console.log("response", response);
        data.documentTypes = response.data;
        data.formData.queryof_user_id = data.retrivedUser[0].id;
        data.formData.usersource = "Known";
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
      loadDocumentTypeSetKnown,
      openClaimForm,
      loadDocumentType,
      loginUser,
      getDocumentTypeCategory,
      data,
      saveFile,
      closeDialog,
      submitFomrm,
      openLogin,
      closeDialogLogin,
      searchQuery,
      trackQuery,
      closeSearchQuery,
      trackUser,
      reloadForm,
      cancelDialog,
      save,
      openSignUp,
      getFile,
      previewFiles,
      closeFilePreview,
    };
  },
});
</script>

<style scoped>
.show-hand {
  cursor: pointer;
}
.custom-title {
  font-size: 18px;
  font-weight: bold;
  color: #bbb;
}
</style>
<style scoped>
.landing-page-background {
  /* Set your background image here */
  background-image: url("./V.jpg");
  background-color: #f4f4f4;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  min-height: 100vh;
}
</style>
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
  background-color: #dad3d3;
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
  background: linear-gradient(#79a70a 0%);
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
