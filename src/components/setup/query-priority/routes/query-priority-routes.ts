import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const queryPriorityRoutes = [
  {
    path: "/query-priority",
    component: () =>
      import(/* webpackChunkName: "QueryPriority" */ "../QueryPriority.vue"),
    meta: {
      requiresAuth: true,
      title: "query-priority",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default queryPriorityRoutes;
