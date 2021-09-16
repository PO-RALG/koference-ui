import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const bankAccountTypesRoutes = [
  {
    path: "/manage-bank-account-types",
    component: () =>
      import(/* webpackChunkName: "Customer" */ "../BankAccountType.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Bank Account Types",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default bankAccountTypesRoutes;
