"use strict";
exports.__esModule = true;
var FundingSourceRoutes = [
    {
        path: "/manage-funding-sources",
        component: function () { return Promise.resolve().then(function () { return require("../FundingSource.vue"); }); },
        meta: { requiresAuth: false, title: "Manage Funding Sources" }
    },
];
exports["default"] = FundingSourceRoutes;
