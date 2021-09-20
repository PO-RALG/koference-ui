"use strict";
exports.__esModule = true;
var middleware_1 = require("@/middleware");
var gfsCategoriesRoutes = [
    {
        path: "/gfs-categories",
        component: function () {
            return Promise.resolve().then(function () { return require(/* webpackChunkName: "GfsCategory" */ "../GfsCategory.vue"); });
        },
        meta: {
            requiresAuth: true,
            title: "Manage GFS Categories",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        }
    },
];
exports["default"] = gfsCategoriesRoutes;
