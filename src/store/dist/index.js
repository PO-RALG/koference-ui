"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var vuex_1 = require("vuex");
vue_1["default"].use(vuex_1["default"]);
exports["default"] = new vuex_1["default"].Store({
    state: {
        snackbar: {}
    },
    getters: {
        getSnackBar: function (state) {
            return state.snackbar;
        }
    },
    mutations: {
        setSnackbar: function (state, payload) {
            state.snackbar = payload;
        }
    },
    actions: {
        notify: function (_a, payload) {
            var commit = _a.commit;
            // console.log("payload dataz", payload);
            commit("setSnackbar", payload);
        }
    }
});
