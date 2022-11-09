import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const revenueAccountRoutes = [
  {
    path: "/revenue-account",
    component: () =>
      import(/* webpackChunkName: "opening-balance" */ "../RevenueAccount.vue"),
    meta: {
      requiresAuth: true,
      title: "RevenueAccount",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default revenueAccountRoutes;
