import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const BankAccountRoutes = [
  {
    path: "/manage-bank-accounts",
    component: () => import(/* webpackChunkName: "BankAccount" */ "../BankAccountComponent.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Bank Accounts",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default BankAccountRoutes;
