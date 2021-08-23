<template>
  <v-col cols="4" class=" caption font-weight-thin" md="1" sm="1">
    <v-select
      :light="true"
      dark
      dense
      :hide-selected="true"
      v-model="currentLang"
      :items="langs"
      @change="changeLang"
    ></v-select>
  </v-col>
</template>

<script>
export default {
  name: "locale-changer",
  components: {},
  props: {
    changeFunction: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      langs: ["English", "Swahili"],
      currentLang: null
    };
  },
  methods: {
    setDefaultAppLanguage() {
      // let user = JSON.parse(localStorage.getItem('sis-user'))
      let locale = localStorage.getItem("locale");
      if (locale !== null) {
        localStorage.setItem("locale", locale); //set default language
        this.$i18n.locale = localStorage.getItem("locale");
      }

      this.currentLang = this.$root.$i18n.locale;
      localStorage.setItem("locale", this.currentLang);
    },

    changeLang() {
      if (this.currentLang == "Swahili") {
        localStorage.setItem("locale", this.currentLang);
        this.$i18n.locale = localStorage.getItem("locale");
      } else {
        localStorage.setItem("locale", "English");
        this.$i18n.locale = localStorage.getItem("locale");
      }
      this.changeFunction(this.currentLang);
    }
  },

  mounted() {
    this.setDefaultAppLanguage();
  },

  computed: {}
};
</script>
