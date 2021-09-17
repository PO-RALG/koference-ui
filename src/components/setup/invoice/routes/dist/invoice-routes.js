"use strict";
exports.__esModule = true;
var middleware_1 = require("@/middleware");
var invoiceRoutes = [
    {
        path: "/manage-invoices",
        component: function () {
            return Promise.resolve().then(function () { return require(/* webpackChunkName: "Customer" */ "../Invoice.vue"); });
        },
        meta: {
            requiresAuth: true,
            title: "Manage Invoice",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        }
    },
];
exports["default"] = invoiceRoutes;
