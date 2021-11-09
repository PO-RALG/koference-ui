"use strict";
exports.__esModule = true;
var middleware_1 = require("@/middleware");
var accountPayableInvoiceRoutes = [
    {
        path: "/manage-receipt",
        component: function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "Receipt" */ "../Receipt.vue"); }); },
        meta: {
            requiresAuth: true,
            title: "Manage Invoice",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        }
    },
];
exports["default"] = accountPayableInvoiceRoutes;
