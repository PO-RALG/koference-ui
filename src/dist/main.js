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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var vue_1 = require("vue");
var axios_1 = require("axios");
var vue_jwt_decode_1 = require("vue-jwt-decode");
var vue_axios_1 = require("vue-axios");
var vue2_perfect_scrollbar_1 = require("vue2-perfect-scrollbar");
var composition_api_1 = require("@vue/composition-api");
var moment_1 = require("moment"); //require
var App_vue_1 = require("@/App.vue");
var router_1 = require("@/router");
var store_1 = require("@/store");
var vuetify_1 = require("@/plugins/vuetify");
require("@/mixins");
var filters_1 = require("./filters");
require("@/assets/main.scss");
require("@/components/shared");
var FormatHelper_1 = require("@/helpers/FormatHelper");
var CurrentUserHelper_1 = require("@/helpers/CurrentUserHelper");
axios_1["default"].defaults.headers.common["Accept"] = "application/json";
axios_1["default"].defaults.headers.common["Content-Type"] = "application/json";
axios_1["default"].defaults.baseURL = process.env.VUE_APP_SERVER_URL;
axios_1["default"].defaults["isLoading"] = true;
var cancelSource = axios_1["default"].CancelToken.source();
var requestHandler = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, CurrentUserHelper_1["default"]()];
            case 1:
                currentUser = _a.sent();
                request.cancelToken = cancelSource.token;
                axios_1["default"].defaults.headers.common["Authorization"] = currentUser
                    ? "Bearer " + currentUser.token
                    : null;
                axios_1["default"].defaults.headers.common["Accept"] = "application/json";
                axios_1["default"].defaults.headers.common["Content-Type"] = "application/json";
                return [2 /*return*/, request];
        }
    });
}); };
var errorHandler = function (error) {
    var payload = {
        error: error.data.errors,
        title: FormatHelper_1["default"](error.data.message),
        color: "info",
        icon: "mdi-alert-box",
        "class": "info--text"
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
        title: FormatHelper_1["default"](response.data.message),
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
vue_1["default"].use(filters_1["default"]);
vue_1["default"].config.productionTip = false;
new vue_1["default"]({
    router: router_1["default"],
    store: store_1["default"],
    vuetify: vuetify_1["default"],
    render: function (h) { return h(App_vue_1["default"]); }
}).$mount("#app");
