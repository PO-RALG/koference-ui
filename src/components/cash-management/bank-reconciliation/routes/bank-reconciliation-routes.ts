import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const bankReconciliationRoutes = [
  {
    path: "/bank-reconciliation",
    component: () => import(/* webpackChunkName: "BankReconciliation" */ "../BankReconciliation.vue"),
    meta: {
      requiresAuth: true,
      title: "Bank Reconciliation",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default bankReconciliationRoutes;
