"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var vue_route_middleware_1 = require("vue-route-middleware");
var store_1 = require("@/store");
var user_1 = require("@/components/user");
var role_1 = require("@/components/role");
var gfs_codes_1 = require("@/components/setup/gfs-codes");
var level_1 = require("@/components/admin-area/level");
var admin_area_1 = require("@/components/admin-area/admin-area");
var financialyears_1 = require("@/components/setup/financialyears");
var fund_types_1 = require("@/components/setup/fund-types");
var gfs_categories_1 = require("@/components/setup/gfs-categories");
var projects_1 = require("@/components/setup/projects");
var customers_1 = require("@/components/setup/customers");
var documentcategories_1 = require("@/components/setup/documentcategories");
var document_1 = require("@/components/setup/document");
var funding_sources_1 = require("@/components/setup/funding-sources");
var sub_budget_classes_1 = require("@/components/setup/sub-budget-classes");
var back_accounts_1 = require("@/components/setup/back-accounts");
var facilitytypes_1 = require("@/components/setup/facilitytypes");
var menu_1 = require("@/components/menu");
var facility_1 = require("@/components/facility");
var bank_account_type_1 = require("@/components/setup/bank-account-type");
var invoice_item_definition_1 = require("@/components/setup/invoice-item-definition");
// import route middlewares
var middleware_1 = require("@/middleware");
vue_1["default"].use(vue_router_1["default"]);
var routes = [
    {
        path: "/login",
        component: function () { return Promise.resolve().then(function () { return require("@/components/auth/Login.vue"); }); },
        meta: { title: "Login", middleware: [middleware_1.setTitle] },
        props: function (route) { return ({ query: route.query }); }
    },
    {
        path: "/",
        component: function () { return Promise.resolve().then(function () { return require("@/layouts/Home.vue"); }); },
        meta: { title: "Dashboard", middleware: [middleware_1.setTitle] },
        children: __spreadArrays(user_1.userRoutes, financialyears_1.financialYearRoutes, gfs_codes_1.gfsCodesRoutes, user_1.userRoutes, level_1.levelRoutes, admin_area_1.adminAreaRoutes, fund_types_1.fundTypesRoutes, gfs_categories_1.gfsCategoriesRoutes, projects_1.projectRoutes, customers_1.customersRoutes, documentcategories_1.documentCategoryRoutes, document_1.documentRoutes, funding_sources_1.fundingSourceRoutes, sub_budget_classes_1.subBudgetClassRoutes, back_accounts_1.bankAccountRoutes, role_1.roleRoutes, facilitytypes_1.facilityTypeRoutes, menu_1.menuRoutes, facility_1.facilityRoutes, bank_account_type_1.bankAccountTypesRoutes, invoice_item_definition_1.invoiceItemDefinitionRoutes)
    },
];
var router = new vue_router_1["default"]({
    mode: "history",
    base: process.env.BASE_URL,
    routes: routes
});
// middlewares
var isLoggedIn = function (to, _, next) {
    var loginStatus = store_1["default"].getters["Auth/getLoginStatus"];
    var loggedIn = loginStatus ? loginStatus.isLoggedIn : false;
    var currentUser = store_1["default"].getters["Auth/getCurrentUser"];
    if (to.matched.some(function (record) { return record.meta.requiresAuth; })) {
        if (loggedIn && currentUser) {
            console.log("user is logged in");
            next();
        }
        else {
            console.log("redirect to login page");
        }
    }
    else {
        next();
    }
};
router.beforeEach(vue_route_middleware_1["default"]({ setTitle: middleware_1.setTitle, validateToken: middleware_1.validateToken, setHeaders: middleware_1.setHeaders, auth: middleware_1.auth }));
exports["default"] = router;
