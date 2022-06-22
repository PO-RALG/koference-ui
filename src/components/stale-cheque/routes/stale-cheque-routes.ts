import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const staleChequeRoutes = [
  {
    path: "/stale-cheques",
    component: () =>
      import(/* webpackChunkName: "StaleCheck" */ "../StaleCheque.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Stale Cheque",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default staleChequeRoutes;
