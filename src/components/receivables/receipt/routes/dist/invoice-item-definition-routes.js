"use strict";
exports.__esModule = true;
var middleware_1 = require("@/middleware");
var invoiceItemDefinitionRoutes = [
    {
        path: "/manage-invoice-item-definition",
        component: function () {
            return Promise.resolve().then(function () { return require(/* webpackChunkName: "Customer" */ "../InvoiceItemDefinition.vue"); });
        },
        meta: {
            requiresAuth: true,
            title: "Manage Invoice Item Definition",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        }
    },
];
exports["default"] = invoiceItemDefinitionRoutes;
