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
  {
    path: "/bank-reconciliation/list",
    component: () => import(/* webpackChunkName: "ReconciliationList" */ "../ReconciliationList.vue"),
    meta: {
      requiresAuth: true,
      title: "Bank Reconciliation List",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default bankReconciliationRoutes;
