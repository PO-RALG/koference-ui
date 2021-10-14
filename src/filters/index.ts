import Vue from "vue";
import format from "./DateFormatter";
import toCurrency from "./CurrencyFormatter";
import capitalizeFirstLatter from "./CapitalizeFirstLatter";

export default {
  install(): void {
    Vue.filter("format", format);
    Vue.filter("toCurrency", toCurrency);
    Vue.filter("capitalizeFirstLatter", capitalizeFirstLatter);
  },
};
