import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const openingBalanceRoutes = [
  {
    path: "/opening-balance",
    component: () => import(/* webpackChunkName: "opening-balance" */ "../OpeningBalance.vue"),
    meta: {
      requiresAuth: true,
      title: "Opening Balance",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default openingBalanceRoutes;
