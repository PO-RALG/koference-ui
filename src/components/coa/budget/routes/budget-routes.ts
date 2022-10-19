import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const budgetRoutes = [
  {
    path: "/manage-budgets",
    component: () => import(/* webpackChunkName: "Project" */ "../budget.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Budgets",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default budgetRoutes;
