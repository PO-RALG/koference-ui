import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const queryRoutes = [
  {
    path: "/query",
    name: "query",
    component: () => import(/* webpackChunkName: "Query" */ "../Query.vue"),
    meta: {
      requiresAuth: true,
      title: "Query",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default queryRoutes;
