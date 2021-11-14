import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const debtorRoutes = [
  {
    path: "manage-debtors",
    component: () => import(/* webpackChunkName: "Debtor" */ "../Debtor.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Debtors",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default debtorRoutes;
