import format from "./DateFormatter";

export default {
  install(Vue) {
    Vue.filter("format", format);
  },
};
