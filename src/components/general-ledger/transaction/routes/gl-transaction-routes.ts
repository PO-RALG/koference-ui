import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const glTransactionRoutes = [
  {
    path: "/manage-gl-transactions",
    component: () => import(/* webpackChunkName: "GLTransaction" */ "../GLTransaction.vue"),
    meta: {
      requiresAuth: true,
      title: "GL Transactions",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default glTransactionRoutes;
