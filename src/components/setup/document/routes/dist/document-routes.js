"use strict";
exports.__esModule = true;
var DocumentRoutes = [
    {
        path: "/manage-document",
        component: function () { return Promise.resolve().then(function () { return require("../Document.vue"); }); },
        meta: { requiresAuth: false, title: "Manage Document" }
    },
];
exports["default"] = DocumentRoutes;
