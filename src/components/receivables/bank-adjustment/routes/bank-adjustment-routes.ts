import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const bankAdjustmentRoutes = [
  {
    path: "/bank-adjustment",
    component: () => import(/* webpackChunkName: "bank-adjustment" */ "../BankAdjustment.vue"),
    meta: {
      requiresAuth: true,
      title: "Bank Adjustment",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default bankAdjustmentRoutes;
