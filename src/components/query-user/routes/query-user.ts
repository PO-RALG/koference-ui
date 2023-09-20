import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const queryUserRoutes = [
  {
    path: "/queryuser",
    name: "queryuser",
    component: () =>
      import(/* webpackChunkName: "QueryUser" */ "../QueryUser.vue"),
    meta: {
      requiresAuth: true,
      title: "Assigned Queries",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default queryUserRoutes;
