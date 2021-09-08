"use strict";
exports.__esModule = true;
var BankAccountRoutes = [
    {
        path: "/manage-bank-accounts",
        component: function () { return Promise.resolve().then(function () { return require("../BankAccount.vue"); }); },
        meta: { requiresAuth: false, title: "Bank Accounts" }
    },
];
exports["default"] = BankAccountRoutes;
