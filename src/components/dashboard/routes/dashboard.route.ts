import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const dashboardRoutes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "Dashboard" */ "../Dashboard.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default dashboardRoutes;
