import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const cashbookRoutes = [
  {
    path: "/cashbook-statement",
    component: () => import(/* webpackChunkName: "cashbookr" */ "../CashbookReport.vue"),
    meta: {
      requiresAuth: true,
      title:  "Cashbook Statement",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default cashbookRoutes;
