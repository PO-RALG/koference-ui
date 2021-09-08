const BankAccountRoutes = [
  {
    path: "/manage-bank-accounts",
    component: () => import("../BankAccount.vue"),
    meta: { requiresAuth: false, title: "Bank Accounts" },
  },
];

export default BankAccountRoutes;
