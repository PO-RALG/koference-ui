"use strict";
exports.__esModule = true;
var middleware_1 = require("@/middleware");
var staleChequeRoutes = [
    {
        path: "/manage-stale-cheque",
        component: function () {
            return Promise.resolve().then(function () { return require(/* webpackChunkName: "StaleCheck" */ "../StaleCheck.vue"); });
        },
        meta: {
            requiresAuth: true,
            title: "Manage Stale Cheque",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        }
    },
];
exports["default"] = staleChequeRoutes;
