"use strict";
exports.__esModule = true;
var DocumentCategoryRoutes = [
    {
        path: "/manage-document-categories",
        component: function () { return Promise.resolve().then(function () { return require("../DocumentCategory.vue"); }); },
        meta: { requiresAuth: false, title: "Manage Document Categories" }
    },
];
exports["default"] = DocumentCategoryRoutes;
