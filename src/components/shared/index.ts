import Vue from "vue";

Vue.component("TreeBrowser", () => import("./TreeBrowser.vue"));
Vue.component("Tree", () => import("./Tree.vue"));
Vue.component("DualMultiSelect", () => import("./DualMultiSelect.vue"));
Vue.component("Modal", () => import("./modal/Modal.vue"));
Vue.component("ModalBody", () => import("./modal/ModalBody.vue"));
Vue.component("ModalHeader", () => import("./modal/ModalHeader.vue"));
Vue.component("ModalFooter", () => import("./modal/ModalFooter.vue"));
Vue.component("Snackbar", () => import("../../utils/SnackBar.vue"));
Vue.component("ConfirmDialog", () => import("./ConfirmDialog.vue"));
Vue.component("Paginate", () => import("./Paginate.vue"));
