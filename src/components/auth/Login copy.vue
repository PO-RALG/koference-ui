<template>
  <v-app
    justify-center
    class="grey lighten-3 pa-0 text-center main-body"
    fluid
    fill-height
  >
    <el-header style="background-color: #1476d7">
      <div class="header-content">
        <el-image :src="data.coat" class="login-logo" fit="cover"></el-image>
        <el-row
          class="custom-title white--text"
          type="flex"
          justify="center"
          align="left"
        >
          <el-col
            class="d-none d-md-flex"
            :span="24"
            style="text-align: center"
          >
            <span style="font-size: 14px; font-weight: bold; color: #ffffff">
              MRADI WA BONDE LA MTO MSIMBAZI (MSIMBAZI BASIN PROJECT)
              (GRM-SYSTEM)
            </span>
          </el-col>

          <el-col class="d-md-none" :md="12"> MALALAMIKO (GRM) </el-col>
        </el-row>
        <v-spacer></v-spacer>
        <el-button
          icon
          @click="toggleDrawer"
          class="d-md-none"
          style="color: black"
        >
          <i class="el-icon-menu"></i>
        </el-button>
        <!-- <v-btn icon @click="toggleDrawer" class="d-md-none white--text">
          <v-icon>mdi-menu</v-icon>
        </v-btn> -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <el-button
              v-bind="attrs"
              v-on="on"
              type="text"
              class="d-none d-md-block white--text"
            >
              <i class="el-icon-question"></i> Umesahau
            </el-button>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in data.resetOption" :key="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <el-button
          type="text"
          @click="openClaimForm"
          class="d-none d-md-block white--text"
        >
          <i class="el-icon-s-promotion"></i> Tuma Lalamiko
        </el-button>
        <el-button
          type="text"
          @click="searchQuery"
          class="d-none d-md-block white--text"
        >
          <i class="el-icon-search"></i> Fuatilia
        </el-button>
        <el-button
          type="text"
          @click="openLogin"
          class="d-none d-md-block white--text"
        >
          <i class="el-icon-user"></i> Login
        </el-button>
      </div>
    </el-header>
    <v-layout justify-center align-center class="landing-page-background">
      <div class="backdrop" @click="closeDrawer" v-if="data.drawer"></div>
      <v-navigation-drawer
        app
        temporary
        left
        width="70%"
        :value="data.drawer"
        @input="data.drawer = $event"
        absolute
      >
        <template v-slot:prepend>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img :src="data.coat" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Msimbazi Basin Project</v-list-item-title>
              <v-list-item-subtitle>GRM SYSTEM</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list>
          <v-list-item
            v-for="item in data.items"
            :key="item.title"
            @click="handleItemClick(item.method)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-footer app class="mb-10">
          <v-sheet color="primary" dark>
            <v-container>
              <v-row>
                <v-col cols="12" class="text-right">
                  <!-- Social media icons with links -->
                  <v-btn icon href="https://www.facebook.com/your-page">
                    <v-icon>mdi-facebook</v-icon>
                  </v-btn>
                  <v-btn icon href="https://twitter.com/your-page">
                    <v-icon>mdi-twitter</v-icon>
                  </v-btn>
                  <v-btn icon href="https://www.instagram.com/your-page">
                    <v-icon>mdi-instagram</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-footer>
      </v-navigation-drawer>

      <v-main align="center" justify="center">
        <v-row align="center" justify="center">
          <v-col cols="8" sm="8" md="7">
            <Modal :modal="data.modal" :width="1000" :fullScreen="true">
              <template v-slot:header>
                <ModalHeader
                  :title="`${data.modalTitle} Utumaji`"
                  :icon="'mdi-send'"
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
                          <v-col cols="12" md="12" class="mb-n8">
                            <v-textarea
                              outlined
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
                            :disabled="!data.formData.description"
                            @click="submitFomrm"
                            color="green lighten-2"
                            large
                            class="white--text"
                            >{{ "Tuma lalamiko" }}
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
                          <v-col cols="12" md="12" class="mb-n8">
                            <v-textarea
                              outlined
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
                            :disabled="!data.formData.description"
                            @click="submitFomrm"
                            color="green lighten-2"
                            large
                            class="white--text"
                            >{{ "Tuma lalamiko" }}
                          </v-btn>
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
                  :title="`Ufuatiliaji`"
                  :icon="'mdi-magnify'"
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
                        <div class="white-box">
                          <div class="row">
                            <div class="col-md-8">
                              <div class="row DetailsDiv">
                                <div class="col-md-12">
                                  <div
                                    class="sub-header py-2 d-flex flex-row justify-content-between"
                                  >
                                    <span class="time-age font-weight-bold">
                                      Age:{{ data.retrivedQuery?.days_passed
                                      }}{{ " Days" }}
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
                                    <div class="underline-text">
                                      CLAIM FROM CLIENT
                                    </div>
                                  </div>
                                </div>
                                <div class="col-md-4">
                                  <div class="box-detail">
                                    <div class="font-weight-bold">
                                      Track Number
                                    </div>
                                    <div class="underline-text">
                                      {{ data.retrivedQuery?.tracknumber }}
                                    </div>
                                  </div>
                                </div>
                                <div class="col-md-4 ng-star-inserted" style="">
                                  <!---->
                                  <div class="box-detail ng-star-inserted">
                                    <div class="font-weight-bold">
                                      Reported to
                                    </div>
                                    <div class="underline-text">
                                      Msimbazi Basin
                                    </div>
                                  </div>
                                  <!---->
                                </div>
                                <!----><!----><!---->

                                <div class="col-md-4 ng-star-inserted">
                                  <div class="box-detail">
                                    <div class="font-weight-bold">
                                      Reported Via
                                    </div>
                                    <div class="underline-text">Website</div>
                                  </div>
                                </div>
                                <!----><!---->
                                <div class="col-md-4">
                                  <div class="box-detail">
                                    <div class="font-weight-bold">
                                      Incidence Origin
                                    </div>
                                    <div class="underline-text">EXTERNAL</div>
                                  </div>
                                </div>
                                <div class="col-md-4">
                                  <div class="box-detail">
                                    <div class="font-weight-bold">
                                      Submission Date
                                    </div>
                                    <div class="underline-text">
                                      {{
                                        data.retrivedQuery?.created | format()
                                      }}
                                    </div>
                                  </div>
                                </div>
                                <div class="col-md-4">
                                  <div class="box-detail">
                                    <div class="font-weight-bold">
                                      Issue Category
                                    </div>
                                    <div class="underline-text">
                                      {{ data.retrivedQuery?.category }}
                                    </div>
                                  </div>
                                </div>
                                <div class="col-md-4 ng-star-inserted" style="">
                                  <div class="box-detail">
                                    <div class="font-weight-bold">
                                      Issue Title
                                    </div>
                                    <div class="underline-text">
                                      Query Submition
                                    </div>
                                  </div>
                                </div>
                                <!---->

                                <!----><!----><!----><!----><!----><!---->
                                <div class="col-md-12">
                                  <div class="box-detail">
                                    <div class="font-weight-bold">
                                      Description
                                    </div>
                                    <div>
                                      <!-- hello, -->
                                      <div class="underline-text">
                                        {{ data.retrivedQuery?.description }}
                                      </div>
                                      <div><br /></div>
                                      <!-- <div>Best Regards,</div> -->
                                      <!-- <div>Innocent Mrema</div> -->
                                    </div>
                                  </div>
                                </div>
                                <!---->

                                <div class="col-md-4 ng-star-inserted" style="">
                                  <div
                                    v-if="data.retrivedQuery?.resolved != null"
                                    class="box-detail"
                                  >
                                    <div class="font-weight-bold">
                                      Closed Date
                                    </div>
                                    <div>
                                      {{
                                        data.retrivedQuery?.resolved | format()
                                      }}
                                    </div>
                                  </div>
                                  <div v-else class="box-detail">
                                    <div class="font-weight-bold">
                                      Closed Date
                                    </div>
                                    <div>{{ "--------------------" }}</div>
                                  </div>
                                </div>
                                <!----><!---->
                              </div>
                            </div>
                            <div class="col-md-4">
                              <v-card
                                class="mat-card mat-focus-indicator shadow-sm mat-elevation-z3"
                                ><p class="ng-star-inserted" style="">
                                  <!----><span
                                    class="ng-star-inserted font-weight-bold pl-4"
                                    >PROGRESS STATUS </span
                                  ><!---->
                                </p>
                                <!---->
                                <p class="resolved ng-star-inserted" style="">
                                  <span class="pl-4"
                                    >This Query is currently at status</span
                                  >
                                  <br />
                                  <v-btn
                                    text
                                    class="primaary--text"
                                    color="green"
                                    >{{ data.retrivedQuery?.status }}
                                  </v-btn>
                                </p>
                                <p
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
            <div class="web-container mt-20 pt-10">
              <app-features-and-services>
                <v-card
                  color="#E3F2FD"
                  class="p-10 lg:p-20 !bg-primary/10 rounded-lg"
                >
                  <web-section-header>
                    <div class="text-center">
                      <h1 class="f-heading">Features And Services</h1>
                      <div class="h-[2px] m-auto !bg-primary w-[100px]"></div>
                    </div>
                  </web-section-header>
                  <v-row
                    class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 mt-10 gap-10 lg:gap-20"
                  >
                    <v-col>
                      <v-row class="flex space-x-0">
                        <v-col class="space-y-3">
                          <v-col
                            class="aspect-square h-10 !bg-primary rounded-md text-white grid place-content-center"
                          >
                            <v-icon x-large color="rgb(59 130 246 / 0.5)"
                              >mdi-email</v-icon
                            >
                          </v-col>
                          <h2
                            class="!text-primary !text-xl font-bold !text-2xl mb-1"
                          >
                            Subscription
                          </h2>
                          <p>
                            GRM allows subscription by the public for obtaining
                            query status information through email and SMS.
                          </p>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col>
                      <v-row>
                        <v-col class="space-y-0">
                          <v-col class="">
                            <v-icon color="rgb(59 130 246 / 0.5)" x-large
                              >mdi-cellphone</v-icon
                            >
                          </v-col>
                          <h2
                            class="!text-primary !text-xl font-bold !text-2xl mb-1"
                          >
                            Mobile Application
                          </h2>
                          <p>
                            GRM mobile application facilitates e-registration of
                            clients and e-submission of their queries through
                            mobile phones or tablets.
                          </p>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col class="space-y-0">
                          <v-col class="">
                            <v-icon color="rgb(59 130 246 / 0.5)" x-large
                              >mdi-monitor-dashboard</v-icon
                            >
                          </v-col>
                          <h2
                            class="!text-primary !text-xl font-bold !text-2xl mb-1"
                          >
                            Reports && Visualization
                          </h2>
                          <p>
                            GRM application facilitates data analysis by
                            providing various reports and visualizations to help
                            you make informed decisions and gain valuable
                            insights into your business.
                          </p>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </app-features-and-services>
            </div>

            <web-footer class="">
              <div class="bg-gray-100 !text-xs">
                <div class="web-container mt-20 pt-10">
                  <v-container>
                    <v-row class="grid xl:grid-cols-12 gap-2 2xl:gap-10">
                      <v-col cols="12" class="pr-9 !font-light white--text">
                        <p>
                          The Msimbazi River Basin is an economically,
                          geographically, and environmentally significant
                          region, home to about 1.6 million people and critical
                          transportation infrastructure that connects the
                          Central Business District of Tanzania's most populous
                          city, Dar es Salaam, with the rest of the city. But
                          flooding has become increasingly severe over the past
                          decade, with major flood events experienced in seven
                          out of the last 10 years. These events are expected to
                          increase with urbanization and climate change. The
                          Government of Tanzania, with a $200 million credit
                          from the World Bank Group’s International Development
                          Association (IDA), established the Msimbazi Basin
                          Development Project (2022-2028) to strengthen flood
                          resilience and integrate urban development efforts in
                          this economically important and flood-prone area of
                          Dar es Salaam. The project is anticipated to benefit
                          from $60 million worth of credit from the Spanish
                          Agency for International Development Cooperation and a
                          grant from the Netherlands Ministry of Foreign Affairs
                          through Invest.
                        </p>
                        <p>
                          GRM System of Msimbazi Project. This system has been
                          developed, hosted, and operated by the Government of
                          the United Republic of Tanzania in 2023 for
                          facilitation of queries functions by means of
                          information and communication technology.
                        </p>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
                <div
                  class="py-3 border-t border-t-gray-300 mt-5 flex items-center"
                >
                  <div class="web-container flex items-center justify-between">
                    <div class="flex space-x-3">
                      <a
                        href="http://www.facebook.com/PPRA_Tanzania-2588600117819083"
                        target="_blank"
                        title="PPRA On Facebook"
                      >
                        <v-img
                          loading="lazy"
                          src="/assets/images/facebook.png"
                        ></v-img>
                      </a>
                      <a
                        href="http://www.twitter.com/PpraTanzania"
                        target="_blank"
                        title="PPRA On Twitter"
                      >
                        <v-img
                          loading="lazy"
                          src="/assets/images/twitter.png"
                        ></v-img>
                      </a>
                      <a
                        href="http://www.instagram.com/ppra_tanzania"
                        target="_blank"
                        title="PPRA On Instagram"
                      >
                        <v-img
                          loading="lazy"
                          src="/assets/images/instagram.png"
                        ></v-img>
                      </a>
                      <a
                        href="https://www.youtube.com/@ppratanzania668"
                        target="_blank"
                        title="PPRA On Youtube"
                      >
                        <v-img
                          loading="lazy"
                          src="/assets/images/youtube.png"
                        ></v-img>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </web-footer>
            <v-footer app>
              <!-- Adjust the background color and text color -->
              <v-sheet color="primary" dark class="d-none d-md-flex">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-img src="/assets/logo.png" height="50"></v-img>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>

              <!-- Footer content -->

              <v-sheet>
                <v-container>
                  <v-row>
                    <v-col>
                      <p class="text-center">
                        &copy; {{ new Date().getFullYear() }}
                        <small class="">
                          {{ "MSIMBAZI BASIN" }}
                        </small>
                        <small class="">
                          {{ ". All right reserved." }}
                        </small>
                        <small class="">
                          <strong>{{ " GRM v1.0 ." }}</strong>
                        </small>
                        <small class="">
                          {{
                            "For any Technical inquiry, please contact your ICT Support Team"
                          }} </small
                        >.
                      </p>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
              <v-spacer></v-spacer>
              <v-sheet color="primary" dark class="d-none d-md-flex">
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-img src="/assets/logo.png" height="50"></v-img>
                    </v-col>
                    <v-col cols="6" class="text-right">
                      <!-- Social media icons with links -->
                      <v-btn icon href="https://www.facebook.com/your-page">
                        <v-icon>mdi-facebook</v-icon>
                      </v-btn>
                      <v-btn icon href="https://twitter.com/your-page">
                        <v-icon>mdi-twitter</v-icon>
                      </v-btn>
                      <v-btn icon href="https://www.instagram.com/your-page">
                        <v-icon>mdi-instagram</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </v-footer>
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
      items: [
        { title: "Lalamika", icon: "mdi-send", method: "openClaimForm" },
        { title: "Fuatilia", icon: "mdi-magnify", method: "searchQuery" },
        { title: "Ingia(Login)", icon: "mdi-login", method: "openLogin" },
      ],
      resetOption: [
        {
          title: "Namba ya utambuzi",
          icon: "mdi-magnify",
          method: "searchQuery",
        },
        {
          title: "Namba ya ufuatiliaji",
          icon: "mdi-send",
          method: "openClaimForm",
        },
      ],
      drawer: false, // Initial state of the navigation drawer
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
        usersource: "Anonymous",
      },
      retrivedQuery: "",
      retrivedUser: "",
    });

    onMounted(() => {
      getQueryCategories({}).then((response: any) => {
        data.queryCategories = response.data;
      });
      loadDocumentTypeSetKnown(1);
      // getAppName().then((response) => {
      //   setAppName(response.data.data);
      //   data.siteName = response.data.data;
      // });
    });
    const toggleDrawer = () => {
      data.drawer = !data.drawer; // Toggle the state of the navigation drawer
    };

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
      data.drawer = false; // Toggle the state of the navigation drawer
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
        data.formData.usersource = "Known";
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
        usersource: "Anonymous",
      };
      loadDocumentTypeSetKnown(1);
      data.drawer = false; // Toggle the state of the navigation drawer
    };
    const closeSearchQuery = () => {
      data.searchQuery = false;
      data.searchTerm = "";
      data.retrivedQuery = "";
    };
    const openClaimForm = () => {
      data.modal = true;
    };
    const handleItemClick = (item) => {
      if (item === "openClaimForm") {
        data.modal = true;
        data.drawer = false;
      }
      if (item === "searchQuery") {
        data.searchQuery = true;
        data.drawer = false;
      }
      if (item === "openLogin") {
        data.modalLogin = true;
        data.drawer = false;
      }
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
          usersource: "Anonymous",
        });
      data.formData.files = [];
      data.documentTypes = [];
      data.retrivedQuery = "";
      data.searchTerm = "";
      loadDocumentTypeSetKnown(1);
      loadDocumentType(1);
      data.selectedOption = "known";
      data.drawer = false; // Toggle the state of the navigation drawer
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
      data.drawer = false; // Toggle the state of the navigation drawer
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
            usersource: "Anonymous",
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

    const closeDrawer = () => {
      console.log("inafika");
      data.drawer = false;
    };

    return {
      closeDrawer,
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
      toggleDrawer,
      handleItemClick,
    };
  },
});
</script>

<style scoped>
.f-heading {
  /* color: #e1dfe9; */
  color: #908e9b;
}
.container {
  display: flex;
  flex-wrap: wra;
  padding: 1rem;
  row-gap: 1rem;
  column-gap: 1rem;
}
.item {
  flex-grow: 1rem;
  flex-shrink: 0;
}
.header-content {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  padding: 0 10px;
}
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
footer {
  margin-top: 20px;
}
.landing-page-background {
  /* Set your background image here */
  /* background-image: url("./V.jpg"); */
  background-color: #41546b;
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
  height: 50px;
  width: 50px;
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
<style>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: none;
}

/* Show the backdrop when the drawer is open */
.v-navigation-drawer[value="true"] + .backdrop {
  display: block;
}
</style>
