<template>
  <v-card class="p-64">
    <v-card-title
      >Class Schedule
      <v-spacer></v-spacer>
      <v-btn @click="createPDF" color="primary">Download as PDF</v-btn>
      <v-spacer></v-spacer>
      <v-select
        :items="fillColleges"
        multiple
        clearable
        single-line
        hide-details
        label="Filter By College"
        @change="filterCollege"
      ></v-select>
      <v-spacer></v-spacer>
      <v-select
        :items="fillPrograms"
        multiple
        clearable
        single-line
        hide-details
        label="Filter By Program"
        @change="filterProgram"
      ></v-select>
      <v-spacer></v-spacer>
      <v-select
        :items="fillOnline"
        multiple
        clearable
        single-line
        hide-details
        label="Filter Online Courses Only"
        @change="filterOnline"
      ></v-select>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search Course" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table
      ref="myTable"
      :loading="progress"
      :rows-per-page-items="[10, 20, 30, 40, 50]"
      :headers="headers"
      :search="search"
      :items="filteredResults"
      class="elevation-1"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th v-for="header in props.headers" :key="header.text">{{ header.text }}</th>
        </tr>
        <tr class="grey lighten-3">
          <th v-for="header in props.headers" :key="header.text">
            <div v-if="filters.hasOwnProperty(header.value)">
              <v-select
                flat
                hide-details
                label="Semester"
                small
                multiple
                clearable
                :items="columnValueList(header.value)"
                v-model="filters[header.value]"
              ></v-select>
            </div>
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <td>
          {{ props.item.StartTime }}<br />
          {{ props.item.Sem }}
        </td>
        <td>{{ props.item.TERMDESC }}</td>
        <td>
          {{ props.item.M1 }} <br />
          {{ props.item.M4 }} <br />
          {{ props.item.M2 }} <br />
          {{ props.item.M3 }}
          <span v-if="props.item.M1 !== ' '">
            <form action="https://www.bkstr.com/webapp/discoverView" method="post">
              <input type="hidden" name="bookstore_id-1" value="193" />
              <input type="hidden" name="term_id-1" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="div-1" value="" />
              <input type="hidden" name="dept-1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course-1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="sect-1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">TextBook</v-btn>
            </form>
            <form action="https://www.bkstr.com/webapp/discoverShop" method="post">
              <input type="hidden" name="merfnbr" value="193" />
              <input type="hidden" name="termDir" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="division1" value="" />
              <input type="hidden" name="department1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="section1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">Bookstore</v-btn>
            </form>
          </span>
        </td>
        <td>
          {{ props.item.T1 }} <br />
          {{ props.item.T4 }} <br />
          {{ props.item.T2 }} <br />
          {{ props.item.T3 }}
          <span v-if="props.item.T1 !== ' '">
            <form action="https://www.bkstr.com/webapp/discoverView" method="post">
              <input type="hidden" name="bookstore_id-1" value="193" />
              <input type="hidden" name="term_id-1" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="div-1" value="" />
              <input type="hidden" name="dept-1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course-1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="sect-1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">TextBook</v-btn>
            </form>
            <form action="https://www.bkstr.com/webapp/discoverShop" method="post">
              <input type="hidden" name="merfnbr" value="193" />
              <input type="hidden" name="termDir" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="division1" value="" />
              <input type="hidden" name="department1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="section1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">Bookstore</v-btn>
            </form>
          </span>
        </td>
        <td>
          {{ props.item.W1 }} <br />
          {{ props.item.W4 }} <br />
          {{ props.item.W2 }} <br />
          {{ props.item.W3 }}
          <span v-if="props.item.W1 !== ' '">
            <form action="https://www.bkstr.com/webapp/discoverView" method="post">
              <input type="hidden" name="bookstore_id-1" value="193" />
              <input type="hidden" name="term_id-1" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="div-1" value="" />
              <input type="hidden" name="dept-1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course-1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="sect-1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">TextBook</v-btn>
            </form>
            <form action="https://www.bkstr.com/webapp/discoverShop" method="post">
              <input type="hidden" name="merfnbr" value="193" />
              <input type="hidden" name="termDir" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="division1" value="" />
              <input type="hidden" name="department1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="section1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">Bookstore</v-btn>
            </form>
          </span>
        </td>
        <td>
          {{ props.item.R1 }} <br />
          {{ props.item.R4 }} <br />
          {{ props.item.R2 }} <br />
          {{ props.item.R3 }}
          <span v-if="props.item.R1 !== ' '">
            <form action="https://www.bkstr.com/webapp/discoverView" method="post">
              <input type="hidden" name="bookstore_id-1" value="193" />
              <input type="hidden" name="term_id-1" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="div-1" value="" />
              <input type="hidden" name="dept-1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course-1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="sect-1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">TextBook</v-btn>
            </form>
            <form action="https://www.bkstr.com/webapp/discoverShop" method="post">
              <input type="hidden" name="merfnbr" value="193" />
              <input type="hidden" name="termDir" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="division1" value="" />
              <input type="hidden" name="department1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="section1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">Bookstore</v-btn>
            </form>
          </span>
        </td>
        <td>
          {{ props.item.F1 }} <br />
          {{ props.item.F4 }} <br />
          {{ props.item.F2 }} <br />
          {{ props.item.F3 }}
          <span v-if="props.item.F1 !== ' '">
            <form action="https://www.bkstr.com/webapp/discoverView" method="post">
              <input type="hidden" name="bookstore_id-1" value="193" />
              <input type="hidden" name="term_id-1" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="div-1" value="" />
              <input type="hidden" name="dept-1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course-1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="sect-1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">TextBook</v-btn>
            </form>
            <form action="https://www.bkstr.com/webapp/discoverShop" method="post">
              <input type="hidden" name="merfnbr" value="193" />
              <input type="hidden" name="termDir" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="division1" value="" />
              <input type="hidden" name="department1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="section1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">Bookstore</v-btn>
            </form>
          </span>
        </td>
        <td>
          {{ props.item.S1 }} <br />
          {{ props.item.S4 }} <br />
          {{ props.item.S2 }} <br />
          {{ props.item.S3 }}
          <span v-if="props.item.S1 !== ' '">
            <form action="https://www.bkstr.com/webapp/discoverView" method="post">
              <input type="hidden" name="bookstore_id-1" value="193" />
              <input type="hidden" name="term_id-1" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="div-1" value="" />
              <input type="hidden" name="dept-1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course-1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="sect-1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">TextBook</v-btn>
            </form>
            <form action="https://www.bkstr.com/webapp/discoverShop" method="post">
              <input type="hidden" name="merfnbr" value="193" />
              <input type="hidden" name="termDir" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="division1" value="" />
              <input type="hidden" name="department1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="section1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">Bookstore</v-btn>
            </form>
          </span>
        </td>
        <td>
          {{ props.item.U1 }} <br />
          {{ props.item.U4 }} <br />
          {{ props.item.U2 }} <br />
          {{ props.item.U3 }}
          <span v-if="props.item.U1 !== ' '">
            <form action="https://www.bkstr.com/webapp/discoverView" method="post">
              <input type="hidden" name="bookstore_id-1" value="193" />
              <input type="hidden" name="term_id-1" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="div-1" value="" />
              <input type="hidden" name="dept-1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course-1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="sect-1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">TextBook</v-btn>
            </form>
            <form action="https://www.bkstr.com/webapp/discoverShop" method="post">
              <input type="hidden" name="merfnbr" value="193" />
              <input type="hidden" name="termDir" :value="'' + props.item.TERMDESC" />
              <input type="hidden" name="division1" value="" />
              <input type="hidden" name="department1" :value="'' + props.item.PREFIX" />
              <input type="hidden" name="course1" :value="'' + props.item.COURSE_NUMBER" />
              <input type="hidden" name="section1" :value="'' + props.item.COURSE_SECTION" />
              <v-btn small color="primary" type="submit">Bookstore</v-btn>
            </form>
          </span>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  data() {
    return {
      progress: false,
      courses: [],
      terms: [],
      search: "",
      selectedTerm: "",
      colleges: [],
      headers: [
        { text: "StartTime", sortable: true, value: "StartTime" },
        { text: "Term", sortable: true, value: "TERMDESC" },
        { text: "Monday", sortable: false, value: "M1" },
        { text: "Tuesday", sortable: true, value: "T2" },
        { text: "Wednesday", sortable: false, value: "W1" },
        { text: "Thursday", sortable: false, value: "R1" },
        { text: "Friday", sortable: false, value: "F1" },
        { text: "Saturday", sortable: false, value: "S1" },
        { text: "Sunday", sortable: false, value: "U1" },
      ],
      filters: {
        TERMDESC: [],
        COLLEGE: "",
        PREFIX: "",
        ONL: "",
      },
    };
  },
  created() {
    this.fetchTerms();
    this.fetchCourses();
  },
  computed: {
    filteredResults() {
      return this.courses.filter((d) => {
        return Object.keys(this.filters).every((f) => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    },
    fillColleges() {
      return [...new Set(this.courses.map((course) => course.COLLEGE))];
    },
    fillPrograms() {
      return [...new Set(this.courses.map((course) => course.PREFIX))];
    },
    fillOnline() {
      return [...new Set(this.courses.map((course) => course.ONL))];
    },
  },
  methods: {
    customFilters(items, filters, filter, headers) {
      // Init the filter class.
      const cf = new this.$MultiFilters(items, filters, filter, headers);
      cf.registerFilter("COLLEGE", function (COLLEGE, items) {
        if (COLLEGE.trim() === "") return items;
        return items.filter((item) => {
          return item.COLLEGE.toLowerCase() === COLLEGE.toLowerCase();
        }, COLLEGE);
      });
      cf.registerFilter("PREFIX", function (PREFIX, items) {
        if (PREFIX.trim() === "") return items;
        return items.filter((item) => {
          return item.PREFIX.toLowerCase() === PREFIX.toLowerCase();
        }, PREFIX);
      });
      // Its time to run all created filters.
      // Will be executed in the order thay were defined.
      return cf.runFilters();
    },
    fetchTerms() {
      this.progress = true;
      axios
        .get(process.env.MIX_APP_URL + "/getTerms")
        .then((response) => {
          this.terms = response.data;
          this.progress = false;
        })
        .catch((error) => {
          console.log(error);
          this.progress = false;
        });
    },
    fetchCourses() {
      this.progress = true;
      axios
        .get(process.env.MIX_APP_URL + "/getCourses")
        .then((response) => {
          this.courses = response.data;
          console.log(this.courses);
          this.progress = false;
        })
        .catch((error) => {
          console.log(error);
          this.progress = false;
        });
    },
    columnValueList(val) {
      return this.courses.map((d) => d[val]);
    },
    filterCollege(val) {
      if (typeof val === "undefined") {
        return;
      }
      this.filters = this.$MultiFilters.updateFilters(this.filters, { COLLEGE: val });
    },
    filterProgram(val) {
      if (typeof val === "undefined") {
        return;
      }
      this.filters = this.$MultiFilters.updateFilters(this.filters, { PREFIX: val });
    },
    filterOnline(val) {
      if (typeof val === "undefined") {
        return;
      }
      this.filters = this.$MultiFilters.updateFilters(this.filters, { ONL: val });
    },
    createPDF() {
      var source = this.$refs["myTable"];
      let rows = [];
      let columnHeader = [
        "Start Time",
        "Term",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      let pdfName = "Schedule";
      source.items.forEach((element) => {
        var temp = [
          element.StartTime,
          element.TERMDESC,
          element.M1 || "" + element.M4 || "" + element.M2 || "" + element.M3 || "",
          element.T1 || "" + element.T4 || "" + element.T2 || "" + element.T3 || "",
          element.W1 || "" + element.W4 || "" + element.W2 || "" + element.W3 || "",
          element.R1 || "" + element.R4 || "" + element.R2 || "" + element.R3 || "",
          element.F1 || "" + element.F4 || "" + element.F2 || "" + element.F3 || "",
          element.S1 || "" + element.S4 || "" + element.S2 || "" + element.S3 || "",
          element.U1 || "" + element.U4 || "" + element.U2 || "" + element.U3 || "",
        ];
        rows.push(temp);
      });
      var doc = new jsPDF();
      doc.autoTable(columnHeader, rows, { startY: 10 });
      doc.save(pdfName + ".pdf");
    },
  },
};
</script>
