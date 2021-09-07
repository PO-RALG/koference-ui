import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store";

import { userRoutes } from "@/components/user";
import { roleRoutes } from "@/components/role";
import { gfsCodesRoutes } from "@/components/settup/gfs-codes";
import { levelRoutes } from "@/components/admin-area/level";
import { adminAreaRoutes } from "@/components/admin-area/admin-area";
import { FinancialYearRoutes } from "@/components/finacialyears";
import { fundTypesRoutes } from "@/components/settup/fund-types";
import { gfsCategoriesRoutes } from "@/components/settup/gfs-categories";
import { ProjectRoutes } from "@/components/settup/projects";
import { CustomersRoutes } from "@/components/customers";
import { DocumentCategoryRoutes } from "@/components/documentcategories";
import { DocumentRoutes } from "@/components/document";
import { FundingSourceRoutes } from "@/components/settup/funding-sources";
import { SubBudgetClassRoutes } from "@/components/settup/sub-budget-classes";
import { BankAccountRoutes } from "@/components/back-accounts";
import { FacilityTypeRoutes } from "@/components/facilitytypes";

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
      ...FinancialYearRoutes,
      ...gfsCodesRoutes,
      ...userRoutes,
      ...levelRoutes,
      ...adminAreaRoutes,
      ...fundTypesRoutes,
      ...gfsCategoriesRoutes,
      ...ProjectRoutes,
      ...CustomersRoutes,
      ...DocumentCategoryRoutes,
      ...DocumentRoutes,
      ...FundingSourceRoutes,
      ...SubBudgetClassRoutes,
      ...BankAccountRoutes,
      ...roleRoutes,
      ...FacilityTypeRoutes,
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
  const loggedIn = store.getters["Auth/isLoggedIn"];

  //console.log("isLoggedIn?", loggedIn);

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
