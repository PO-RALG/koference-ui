import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const notFoundRoute = [
  {
    path: "/:catchAll(.*)*",
    //path: "/xx",
    component: () => import(/* webpackChunkName: "404" */ "../404.vue"),
    meta: {
      requiresAuth: true,
      title: "404- PageNotFound",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default notFoundRoute;
