"use strict";
exports.__esModule = true;
var FinancialYearRoutes = [
    {
        path: "/manage-financial-years",
        component: function () { return Promise.resolve().then(function () { return require("../FinancialYear.vue"); }); },
        meta: { requiresAuth: false, title: "Manage Financial Years" }
    },
];
exports["default"] = FinancialYearRoutes;
