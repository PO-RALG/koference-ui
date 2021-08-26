"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var vue_1 = require("vue");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
var store_1 = require("@/store");
var vuetify_1 = require("./plugins/vuetify");
var axios_1 = require("axios");
var vue_axios_1 = require("vue-axios");
require("./assets/main.scss");
require("./components/shared");
var vue2_perfect_scrollbar_1 = require("vue2-perfect-scrollbar");
var composition_api_1 = require("@vue/composition-api");
axios_1["default"].defaults.headers.common["Accept"] = "application/json";
axios_1["default"].defaults.headers.common["Content-Type"] = "application/json";
axios_1["default"].defaults.baseURL = process.env.VUE_APP_SERVER_URL;
var snackbar = {
    show: false,
    color: "",
    icon: "",
    message: ""
};
var requestHandler = function (request) {
    return request;
};
var errorHandler = function (error) {
    switch (error.response.status) {
        case 500:
            show500ErrorSnackbar(error.response);
            break;
    }
    return Promise.reject(__assign({}, error));
};
var successHandler = function (response) {
    switch (response.config.method) {
        case "put":
        case "post":
        case "delete":
            snackbar.show = true;
            snackbar.color = "success";
            snackbar.icon = "mdi-checkbox-marked-circle";
            snackbar.message = response.data.message;
            console.log("mesage", response.data.message);
            // store.dispatch("notify", snackbar);
            store_1["default"].state.snackbar = snackbar;
    }
    return response;
};
var show500ErrorSnackbar = function (response) {
    console.log("500", response);
    snackbar.message = "500: " + response.statusText;
    snackbar.show = true;
    snackbar.color = "red";
    snackbar.icon = " mdi-alert";
};
//  Add interceptors
axios_1["default"].interceptors.request.use(function (request) { return requestHandler(request); });
axios_1["default"].interceptors.response.use(function (response) { return successHandler(response); }, function (error) { return errorHandler(error); });
vue_1["default"].use(composition_api_1["default"]);
vue_1["default"].use(vue2_perfect_scrollbar_1["default"]);
vue_1["default"].use(vue_axios_1["default"], axios_1["default"]);
vue_1["default"].config.productionTip = false;
new vue_1["default"]({
    router: router_1["default"],
    store: store_1["default"],
    vuetify: vuetify_1["default"],
    render: function (h) { return h(App_vue_1["default"]); }
}).$mount("#app");
