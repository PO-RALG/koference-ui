"use strict";
exports.__esModule = true;
var middleware_1 = require("@/middleware");
var genericCustomerYearRoutes = [
    {
        path: "/manage-generic-customers",
        component: function () {
            return Promise.resolve().then(function () { return require(
            /* webpackChunkName: "GnenericCustomer" */ "../GenericCustomer.vue"); });
        },
        meta: {
            requiresAuth: true,
            title: "Manage Generic customer",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        }
    },
];
exports["default"] = genericCustomerYearRoutes;
