import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VueRouteMiddleware from "vue-route-middleware";
import store from "@/store";

import { userRoutes } from "@/components/user";
import { roleRoutes } from "@/components/role";
import { gfsCodesRoutes } from "@/components/setup/gfs-codes";
import { levelRoutes } from "@/components/admin-area/level";
import { adminAreaRoutes } from "@/components/admin-area/admin-area";
import { financialYearRoutes } from "@/components/setup/financialyears";
import { fundTypesRoutes } from "@/components/setup/fund-types";
import { gfsCategoriesRoutes } from "@/components/setup/gfs-categories";
import { projectRoutes } from "@/components/setup/projects";
import { customersRoutes } from "@/components/setup/customers";
import { documentCategoryRoutes } from "@/components/setup/documentcategories";
import { documentRoutes } from "@/components/setup/document";
import { fundingSourceRoutes } from "@/components/setup/funding-sources";
import { subBudgetClassRoutes } from "@/components/setup/sub-budget-classes";
import { bankAccountRoutes } from "@/components/setup/back-accounts";
import { facilityTypeRoutes } from "@/components/setup/facilitytypes";
import { menuRoutes } from "@/components/menu";
import { facilityRoutes } from "@/components/facility";
import { bankAccountTypesRoutes } from "@/components/setup/bank-account-type";
import { invoiceItemDefinitionRoutes } from "@/components/setup/invoice-item-definition";

// import route middlewares
import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    component: () => import("@/components/auth/Login.vue"),
    meta: { title: "Login", middleware: [setTitle] },
    props: (route) => ({ query: route.query }),
  },
  {
    path: "/",
    component: () => import("@/layouts/Home.vue"),
    meta: { title: "Dashboard", middleware: [setTitle] },
    children: [
      ...userRoutes,
      ...financialYearRoutes,
      ...gfsCodesRoutes,
      ...userRoutes,
      ...levelRoutes,
      ...adminAreaRoutes,
      ...fundTypesRoutes,
      ...gfsCategoriesRoutes,
      ...projectRoutes,
      ...customersRoutes,
      ...documentCategoryRoutes,
      ...documentRoutes,
      ...fundingSourceRoutes,
      ...subBudgetClassRoutes,
      ...bankAccountRoutes,
      ...roleRoutes,
      ...facilityTypeRoutes,
      ...menuRoutes,
      ...facilityRoutes,
      ...bankAccountTypesRoutes,
      ...invoiceItemDefinitionRoutes,
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// middlewares
const isLoggedIn = (to, _, next) => {
  const loginStatus = store.getters["Auth/getLoginStatus"];
  const loggedIn = loginStatus ? loginStatus.isLoggedIn : false;
  const currentUser = store.getters["Auth/getCurrentUser"];

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (loggedIn && currentUser) {
      console.log("user is logged in");
      next();
    } else {
      console.log("redirect to login page");
    }
  } else {
    next();
  }
};

router.beforeEach(
  VueRouteMiddleware({ setTitle, validateToken, setHeaders, auth })
);

export default router;
