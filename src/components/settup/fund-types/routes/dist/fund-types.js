"use strict";
exports.__esModule = true;
var fundTypesRoutes = [
    {
        path: "/manage-fund-types",
        component: function () { return Promise.resolve().then(function () { return require("../FundTypes.vue"); }); },
        meta: { requiresAuth: false, title: "Fund Types" }
    },
];
exports["default"] = fundTypesRoutes;
