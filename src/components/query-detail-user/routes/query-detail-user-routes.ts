import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const queryDetailUserRoutes = [
  {
    path: "/anotheruser/:id",
    name: "anotheruser",
    component: () =>
      import(
        /* webpackChunkName: "QueryDetailUser" */ "../QueryDetailUser.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Query Detail User",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default queryDetailUserRoutes;
