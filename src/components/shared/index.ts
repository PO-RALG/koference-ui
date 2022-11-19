import Vue from "vue";

Vue.component("TreeBrowser", () => import("./tree-browser/TreeBrowser.vue"));
Vue.component(
  "ReportTreeBrowser",
  () => import("./report-tree/ReportTreeBrowser.vue")
);
Vue.component("InfoDialog", () => import("./info-dialog/InfoDialog.vue"));
Vue.component("Fetcher", () => import("./form/Fetcher.vue"));
Vue.component("DualMultiSelect", () => import("./DualMultiSelect.vue"));
Vue.component("Modal", () => import("./modal/Modal.vue"));
Vue.component("ModalBody", () => import("./modal/ModalBody.vue"));
Vue.component("ModalHeader", () => import("./modal/ModalHeader.vue"));
Vue.component("ModalFooter", () => import("./modal/ModalFooter.vue"));
Vue.component("Snackbar", () => import("../../utils/SnackBar.vue"));
Vue.component("ConfirmDialog", () => import("./ConfirmDialog.vue"));
Vue.component("Paginate", () => import("./Paginate.vue"));
Vue.component("SearchField", () => import("./SearchField.vue"));
Vue.component("DatePicker", () => import("./DatePicker.vue"));
Vue.component("BaseErrorMessage", () => import("./form/BaseErrorMessage.vue"));
Vue.component("BaseSelect", () => import("./form/BaseSelect.vue"));
Vue.component("BaseCheckbox", () => import("./form/Checkbox.vue"));
Vue.component("Loader", () => import("./Loader.vue"));
Vue.component("AppLocationHeader", () => import("./AppLocationHeader.vue"));
Vue.component("EqualHeights", () => import("./equal-heights/EqualHeights.vue"));
Vue.component("DatePickerReport", () => import("./DatePickerReport.vue"));
