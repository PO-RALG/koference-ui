import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const mmamaPaymentRoutes = [
  {
    path: "/manage-mmama-payments",
    component: () =>
      import(/* webpackChunkName: "FinancialYear" */ "../MmamaPayment.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Financial Years",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default mmamaPaymentRoutes;
