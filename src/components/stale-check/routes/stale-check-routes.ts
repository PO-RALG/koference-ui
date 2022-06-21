import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const staleChequeRoutes = [
  {
    path: "/manage-stale-cheque",
    component: () =>
      import(/* webpackChunkName: "StaleCheck" */ "../StaleCheck.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Stale Cheque",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default staleChequeRoutes;
