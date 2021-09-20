"use strict";
exports.__esModule = true;
var ProjectRoutes = [
    {
        path: "/manage-project",
        component: function () { return Promise.resolve().then(function () { return require("../Project.vue"); }); },
        meta: { requiresAuth: false, title: "Manage Projects" }
    },
];
exports["default"] = ProjectRoutes;
