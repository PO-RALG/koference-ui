import format from "./DateFormatter";
import toCurrency from "./CurrencyFormatter";

export default {
  install(Vue) {
    Vue.filter("format", format);
    Vue.filter("toCurrency", toCurrency);
  },
};
