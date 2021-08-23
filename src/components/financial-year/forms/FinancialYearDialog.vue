<!--start dialog template -->
<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }} Academic Year</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="12">
                <v-text-field label="Academic Year Name" v-model="formData.name" required></v-text-field>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12">
                <v-select
                  :items="types"
                  item-text="name"
                  label="Academic Year Type"
                  v-model="formData.type"
                  required
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="12">
                <DatePicker :label="'Start Date'" v-model="formData.startDate" />
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12">
                <DatePicker :label="'End Date'" v-model="formData.endDate" />
              </v-col>
            </v-row>
            <v-col cols="12" lg="6" md="6" sm="12">
              <v-checkbox v-model="formData.current" class="mx-2" label="Is current ?" hide-details></v-checkbox>
            </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Close</v-btn>
          <v-btn color="blue darken-1" text @click="save">{{ title }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<!--end dialog-->

<script>
import { mapActions } from "vuex";

export default {
  components: {},
  props: ["dialog", "formData", "types"],
  name: "AcademicYearDialog",
  academicYear: {},
  data: () => ({}),
  methods: {
    ...mapActions("AcademicYear", { create: "create" }),

    ...mapActions("AcademicYear", { update: "update" }),

    ...mapActions("AcademicYear", { init: "get" }),

    save() {
      if (this.formData.id) {
        this.update([this.formData]).then(() => {
          this.init();
          this.$emit("closeDialog");
        });
      } else {
        this.create([this.formData]).then(() => {
          this.init();
          this.$emit("closeDialog");
        });
      }
    },

    close() {
      this.$emit("closeDialog");
    },
  },

  computed: {
    title() {
      return this.formData.id ? "Update" : "Create";
    },
  },

  mounted() {},
};
</script>
