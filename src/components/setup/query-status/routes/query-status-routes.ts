import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const queryStatusRoutes = [
  {
    path: "/query-status",
    component: () =>
      import(/* webpackChunkName: "QueryStatus" */ "../QueryStatus.vue"),
    meta: {
      requiresAuth: true,
      title: "Query Status",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default queryStatusRoutes;
