import Vue from "vue";
import format from "./DateFormatter";
import toCurrency from "./CurrencyFormatter";

export default {
  install(): void {
    Vue.filter("format", format);
    Vue.filter("toCurrency", toCurrency);
  },
};
