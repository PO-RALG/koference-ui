<template>
  <v-container>
    <h2>
      Report Details Component for <span class="">{{ location.name }}</span>
    </h2>
    <br />
    <v-card elevation="1">
      <v-card-text class="mt-n8">
        <v-form ref="form">
          <v-container>
            <v-row class="mt-n8">
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete
                  v-model="formData.calendar_year"
                  :items="selectedYearFilter"
                  class="pr-2 pt-6 my-input"
                  dense
                  clearable
                  item-text="name"
                  item-value="id"
                  :label="$t('CALENDER_YEAR')"
                  v-bind:class="{
                    'v-input--is-disabled': isEnabled('calendar_year')
                  }"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12">
                <v-select
                  :items="formats"
                  v-model="exportFormat"
                  :item-value="'id'"
                  label="Report Format"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="mt-n8">
              <v-col cols="12" lg="6" md="6" sm="12">
                <v-select
                  :items="academicYears"
                  :item-text="'name'"
                  v-model="formData.academic_year_id"
                  :item-value="'id'"
                  label="Academic Year"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="mr-5 mt-n10">
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          :disabled="false"
          text
          @click="printReport"
        >
          DOWNLOAD REPORT
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script charset="utf-8">
</script>
