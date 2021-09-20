import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const subBudgetClassRoutes = [
  {
    path: "/manage-sub-budget-classes",
    component: () => import(/* webpackChunkName: "SubBudgetClass" */ "../SubBudgetClass.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Sub Budget Classes",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default subBudgetClassRoutes;
