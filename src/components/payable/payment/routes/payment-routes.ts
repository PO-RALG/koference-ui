import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const paymentRoutes = [
  {
    path: "/manage-payments",
    component: () => import("../Payment.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Payments",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default paymentRoutes;
