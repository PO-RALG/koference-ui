"use strict";
exports.__esModule = true;
var middleware_1 = require("@/middleware");
var invoiceDebtorsRoutes = [
    {
        path: "manage-invoice-debtors",
        component: function () {
            return Promise.resolve().then(function () { return require(/* webpackChunkName: "InvoiceDebtor" */ "../InvoiceDebtor.vue"); });
        },
        meta: {
            requiresAuth: true,
            title: "Manage Invoice Debtors",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        }
    },
];
exports["default"] = invoiceDebtorsRoutes;
