import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import VueRouteMiddleware from "vue-route-middleware";

import { dashboardRoutes } from "@/components/dashboard";
import { userRoutes } from "@/components/user";
import { roleRoutes } from "@/components/role";
import { levelRoutes } from "@/components/admin-area/level";
import { adminAreaRoutes } from "@/components/admin-area/admin-area";
import { queryRoutes } from "@/components/query";
import { queryDetailRoutes } from "@/components/query-detail";
import { queryDetailUserRoutes } from "@/components/query-detail-user";
import { financialYearRoutes } from "@/components/setup/financial-year";
import { queryUserRoutes } from "@/components/query-user";

import { queryCategoryRoutes } from "@/components/setup/query-category";
import { queryStatusRoutes } from "@/components/setup/query-status";
import { queryDocumentTypeRoutes } from "@/components/setup/query-document_type";
import { menuRoutes } from "@/components/menu";
//import { testRoutes } from "@/components/test";
import { notFoundRoute } from "@/components/404";
import { reportFilterRoutes } from "@/components/report/report-filters/";
//import route middlewares
import { auth, setHeaders, setTitle, validateToken } from "@/middleware";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    component: () => import("@/components/auth/Login.vue"),
    meta: {
      title: "Login",
      middleware: [setTitle],
    },
    props: (route: Route) => ({ query: route.query }),
  },
  {
    path: "/",
    component: () => import("@/layouts/Home.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
    children: [
      ...dashboardRoutes,
      ...userRoutes,
      ...financialYearRoutes,
      ...userRoutes,
      ...levelRoutes,
      ...adminAreaRoutes,
      ...queryCategoryRoutes,
      ...queryStatusRoutes,
      ...queryDocumentTypeRoutes,
      ...roleRoutes,
      ...menuRoutes,
      ...reportFilterRoutes,
      ...queryRoutes,
      ...queryDetailRoutes,
      ...queryDetailUserRoutes,
      ...queryUserRoutes,
      ...notFoundRoute,
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.VITE_APP_PUBLIC_PATH,
  routes,
});

// middlewares
router.beforeEach(
  VueRouteMiddleware({ setTitle, validateToken, setHeaders, auth })
);

export default router;
