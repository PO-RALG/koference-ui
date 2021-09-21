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
var axios_1 = require("axios");
var vue_jwt_decode_1 = require("vue-jwt-decode");
var vue_axios_1 = require("vue-axios");
var vue2_perfect_scrollbar_1 = require("vue2-perfect-scrollbar");
var composition_api_1 = require("@vue/composition-api");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
var store_1 = require("@/store");
var vuetify_1 = require("./plugins/vuetify");
require("@/mixins");
var moment_1 = require("moment"); //require
vue_1["default"].filter("myDate", function (created) {
    return moment_1["default"](created).format("Do MMMM YYYY");
});
require("./assets/main.scss");
require("./components/shared");
axios_1["default"].defaults.headers.common["Accept"] = "application/json";
axios_1["default"].defaults.headers.common["Content-Type"] = "application/json";
axios_1["default"].defaults.baseURL = process.env.VUE_APP_SERVER_URL;
var currentUser = store_1["default"].getters["Auth/getCurrentUser"];
axios_1["default"].defaults["isLoading"] = true;
axios_1["default"].defaults.headers.common["Authorization"] = currentUser
    ? "Bearer " + currentUser.token
    : null;
axios_1["default"].defaults.headers.common["Accept"] = "application/json";
axios_1["default"].defaults.headers.common["Content-Type"] = "application/json";
var cancelSource = axios_1["default"].CancelToken.source();
var requestHandler = function (request) {
    request.cancelToken = cancelSource.token;
    return request;
};
var errorHandler = function (error) {
    var payload = {
        error: error.data.errors,
        title: error.data.message,
        color: "error",
        icon: "mdi-alert-box",
        "class": "error--text"
    };
    switch (error.data.message) {
        case "Token has expired":
            showLoginDialog(error.data);
            break;
        default:
            store_1["default"].dispatch("SnackBar/SHOW", payload);
            break;
    }
    return Promise.reject(__assign({}, error.data));
};
var successHandler = function (response) {
    var payload = {
        title: response.data.message,
        color: "success",
        icon: "mdi-information",
        "class": "message success--text"
    };
    switch (response.config.method) {
        case "put":
        case "post":
        case "delete":
            store_1["default"].dispatch("SnackBar/SHOW", payload);
    }
    return response;
};
var showLoginDialog = function (response) {
    var resp = { message: response.message };
    store_1["default"].dispatch("LoginDialog/SHOW", resp);
};
axios_1["default"].interceptors.request.use(function (config) {
    if (config["isLoading"]) {
        store_1["default"].dispatch("Loader/PENDING");
    }
    return requestHandler(config);
}, function (error) {
    if (error.config["isLoading"]) {
        store_1["default"].dispatch("Loader/DONE");
    }
    return errorHandler(error);
});
axios_1["default"].interceptors.response.use(function (response) {
    if (response.config["isLoading"]) {
        store_1["default"].dispatch("Loader/DONE");
    }
    return successHandler(response);
}, function (error) {
    var response = error.response;
    if (response.config["isLoading"]) {
        store_1["default"].dispatch("Loader/DONE");
    }
    return errorHandler(response);
});
vue_1["default"].use(composition_api_1["default"]);
vue_1["default"].use(vue_jwt_decode_1["default"]);
vue_1["default"].use(vue2_perfect_scrollbar_1["default"]);
vue_1["default"].use(vue_axios_1["default"], axios_1["default"], moment_1["default"]);
vue_1["default"].config.productionTip = false;
new vue_1["default"]({
    router: router_1["default"],
    store: store_1["default"],
    vuetify: vuetify_1["default"],
    render: function (h) { return h(App_vue_1["default"]); }
}).$mount("#app");
