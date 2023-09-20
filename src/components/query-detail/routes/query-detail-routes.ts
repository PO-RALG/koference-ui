import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const queryDetailRoutes = [
  {
    path: "/another/:id",
    name: "another",
    component: () =>
      import(/* webpackChunkName: "QueryDetail" */ "../QueryDetail.vue"),
    meta: {
      requiresAuth: true,
      title: "Query Detail",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default queryDetailRoutes;
