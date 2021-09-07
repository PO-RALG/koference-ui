"use strict";
exports.__esModule = true;
var CustomersRoutes = [
    {
        path: "/manage-customers",
        component: function () { return Promise.resolve().then(function () { return require("../Customer.vue"); }); },
        meta: { requiresAuth: false, title: "Manage Customers" }
    },
];
exports["default"] = CustomersRoutes;
