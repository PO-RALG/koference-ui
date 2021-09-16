import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VueRouteMiddleware from "vue-route-middleware";
import store from "@/store";

import { userRoutes } from "@/components/user";
import { roleRoutes } from "@/components/role";
import { gfsCodesRoutes } from "@/components/setup/gfs-code";
import { levelRoutes } from "@/components/admin-area/level";
import { adminAreaRoutes } from "@/components/admin-area/admin-area";
import { financialYearRoutes } from "@/components/setup/financial-year";
import { fundTypesRoutes } from "@/components/setup/fund-type";
import { gfsCategoriesRoutes } from "@/components/setup/gfs-category";
import { projectRoutes } from "@/components/setup/project";
import { customersRoutes } from "@/components/setup/customer";
import { documentCategoryRoutes } from "@/components/setup/document-category";
import { documentRoutes } from "@/components/setup/document";
import { fundingSourceRoutes } from "@/components/setup/funding-source";
import { subBudgetClassRoutes } from "@/components/setup/sub-budget-class";
import { bankAccountRoutes } from "@/components/setup/bank-account";
import { facilityTypeRoutes } from "@/components/facility-type";
import { menuRoutes } from "@/components/menu";
import { facilityRoutes } from "@/components/facility";
import { bankAccountTypesRoutes } from "@/components/setup/bank-account-type";
import { invoiceItemDefinitionRoutes } from "@/components/setup/invoice-item-definition";
import { activityRoutes } from "@/components/planning/activity";
import { activityCostingRoutes } from "@/components/planning/activity-costing";
import { revenueProjectionRoutes } from "@/components/planning/revenue-projection";

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
      ...activityRoutes,
      ...activityCostingRoutes,
      ...revenueProjectionRoutes,
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
