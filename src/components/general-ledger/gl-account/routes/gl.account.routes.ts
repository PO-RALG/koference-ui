import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const glAccountRoutes = [
  {
    path: "/manage-gl-accounts",
    component: () => import(/* webpackChunkName: "GLAccount" */ "../GLAccount.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage GL Accounts",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default glAccountRoutes;
