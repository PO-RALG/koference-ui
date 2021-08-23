"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
vue_1["default"].use(vue_router_1["default"]);
var DEFAULT_TITLE = "FFARS - Facility Financial Accounting & Reporting System";
var routes = [
    {
        path: "/login",
        component: function () { return Promise.resolve().then(function () { return require("@/components/auth/Login.vue"); }); },
        meta: { title: "Login" }
    },
    {
        path: "/",
        component: function () { return Promise.resolve().then(function () { return require("@/layouts/Home.vue"); }); },
        meta: { title: "Dashboard" },
        children: [
            {
                path: "/financial-years",
                component: function () {
                    return Promise.resolve().then(function () { return require("@/components/financial-year/FinancialYear.vue"); });
                },
                meta: { title: "FinancialYear" },
                children: []
            },
        ]
    },
];
var router = new vue_router_1["default"]({
    mode: "history",
    base: process.env.BASE_URL,
    routes: routes
});
router.beforeEach(function (to, from, next) {
    //const loggedIn = JSON.parse(localStorage.getItem("ffarsUser")) || null;
    var loggedIn = false;
    // Use next tick to handle router history correctly
    // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
    vue_1["default"].nextTick(function () {
        document.title =
            to.meta.title + " - Facility Financial Accounting & Reporting System (FFARS)" ||
                DEFAULT_TITLE;
    });
    if (to.matched.some(function (record) { return record.meta.requiresAuth; })) {
        if (loggedIn) {
            next();
        }
        else {
            next("/login");
        }
    }
    else {
        next();
    }
});
exports["default"] = router;
