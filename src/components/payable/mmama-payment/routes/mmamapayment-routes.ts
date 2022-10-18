import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const mmamaPaymentRoutes = [
  {
    path: "/manage-mmama-payments",
    component: () =>
      import(/* webpackChunkName: "MmamaPayment" */ "../MmamaPayment.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Mmama Payment",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default mmamaPaymentRoutes;
