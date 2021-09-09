import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store";

import { userRoutes } from "@/components/user";
import { roleRoutes } from "@/components/role";
import { gfsCodesRoutes } from "@/components/setup/gfs-codes";
import { levelRoutes } from "@/components/admin-area/level";
import { adminAreaRoutes } from "@/components/admin-area/admin-area";
import { financialYearRoutes } from "@/components/setup/financialyears";
import { fundTypesRoutes } from "@/components/setup/fund-types";
import { gfsCategoriesRoutes } from "@/components/setup/gfs-categories";
import { ProjectRoutes } from "@/components/setup/projects";
import { customersRoutes } from "@/components/setup/customers";
import { documentCategoryRoutes } from "@/components/setup/documentcategories";
import { documentRoutes } from "@/components/setup/document";
import { fundingSourceRoutes } from "@/components/setup/funding-sources";
import { subBudgetClassRoutes } from "@/components/setup/sub-budget-classes";
import { bankAccountRoutes } from "@/components/setup/back-accounts";
import { facilityTypeRoutes } from "@/components/setup/facilitytypes";
import { facilityRoutes } from "@/components/facility";

Vue.use(VueRouter);

const DEFAULT_TITLE = "FFARS - Facility Financial Accounting & Reporting System";

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    component: () => import("@/components/auth/Login.vue"),
    meta: { title: "Login" },
  },
  {
    path: "/",
    component: () => import("@/layouts/Home.vue"),
    meta: { title: "Dashboard" },
    children: [
      ...userRoutes,
      ...financialYearRoutes,
      ...gfsCodesRoutes,
      ...userRoutes,
      ...levelRoutes,
      ...adminAreaRoutes,
      ...fundTypesRoutes,
      ...gfsCategoriesRoutes,
      ...ProjectRoutes,
      ...customersRoutes,
      ...documentCategoryRoutes,
      ...documentRoutes,
      ...fundingSourceRoutes,
      ...subBudgetClassRoutes,
      ...bankAccountRoutes,
      ...roleRoutes,
      ...facilityTypeRoutes,
      ...facilityRoutes,
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
  const loginStatus = store.getters["Auth/getLoginStatus"];
  const loggedIn = loginStatus? loginStatus.isLoggedIn : false;

  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609

  Vue.nextTick(() => {
    document.title = `${to.meta.title} - Facility Financial Accounting & Reporting System (FFARS)` || DEFAULT_TITLE;
  });

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (loggedIn) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
