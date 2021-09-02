"use strict";
exports.__esModule = true;
var SubBudgetClassRoutes = [
    {
        path: "/manage-sub-budget-classes",
        component: function () { return Promise.resolve().then(function () { return require("../SubBudgetClass.vue"); }); },
        meta: { requiresAuth: false, title: "Manage Sub Budget Class" }
    },
];
exports["default"] = SubBudgetClassRoutes;
