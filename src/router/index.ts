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
import { queryPriorityRoutes } from "@/components/setup/query-priority";

import { queryCategoryRoutes } from "@/components/setup/query-category";
import { queryStatusRoutes } from "@/components/setup/query-status";
import { queryDocumentTypeRoutes } from "@/components/setup/query-document_type";
import { menuRoutes } from "@/components/menu";
import { reportFilterRoutes } from "@/components/report/report-filters/";
import { notFoundRoute } from "@/components/404";
//import route middlewares
import { auth, setHeaders, setTitle, validateToken } from "@/middleware";

import About from "@/components/About.vue";
import ConferenceRegistration from "@/components/ConferenceRegistration.vue";

import Abstract from "@/components/Abstract.vue";
import Authentication from "@/components/Authentication.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    component: () => import("@/layouts/default/Default.vue"),
    meta: {
      title: "Default",
      middleware: [setTitle],
    },
    props: (route: Route) => ({ query: route.query }),

    children: [
      {
        path: "",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import('@/views/Home.vue'),
      },
      {
        path: "/about-page",
        name: "Conference About",
        component: About,
      },
      {
        path: "/registration-page",
        name: "Conference Registration",
        component: ConferenceRegistration,
      },
      {
        path: "/about-page",
        name: "Conference About",
        component: About,
      },
      {
        path: "/abstract-page",
        name: "Abstract",
        component: Abstract,
      },
      {
        path: "/authentication",
        name: "Login",
        component: Authentication,
      },
    ],
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
      ...queryPriorityRoutes,
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
