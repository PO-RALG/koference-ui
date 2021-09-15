"use strict";
exports.__esModule = true;
var middleware_1 = require("@/middleware");
var bankAccountTypesRoutes = [
    {
        path: "/manage-bank-account-types",
        component: function () {
            return Promise.resolve().then(function () { return require(/* webpackChunkName: "Customer" */ "../BankAccountType.vue"); });
        },
        meta: {
            requiresAuth: true,
            title: "Manage Bank Account Types",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        }
    },
];
exports["default"] = bankAccountTypesRoutes;
