import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import { userRoutes } from "@/components/user";
import { FinancialYearRoutes } from "@/components/finacial-year";
import { gfsCodesRoutes } from "@/components/settup/gfs-codes";

Vue.use(VueRouter);

const DEFAULT_TITLE =
  "FFARS - Facility Financial Accounting & Reporting System";

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
    children: [...userRoutes, ...FinancialYearRoutes, ...gfsCodesRoutes],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
  //const loggedIn = JSON.parse(localStorage.getItem("ffarsUser")) || null;

  const loggedIn = false;

  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609

  Vue.nextTick(() => {
    document.title =
      `${to.meta.title} - Facility Financial Accounting & Reporting System (FFARS)` ||
      DEFAULT_TITLE;
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
