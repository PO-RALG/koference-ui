"use strict";
exports.__esModule = true;
var FacilityTypeRoutes = [
    {
        path: "/manage-facility-types",
        component: function () { return Promise.resolve().then(function () { return require("../FacilityType.vue"); }); },
        meta: { requiresAuth: false, title: "Manage Facility Type" }
    },
];
exports["default"] = FacilityTypeRoutes;
