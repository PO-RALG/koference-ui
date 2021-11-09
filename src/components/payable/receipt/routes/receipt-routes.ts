import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const accountPayableInvoiceRoutes = [
  {
    path: "/manage-receipt",
    component: () => import(/* webpackChunkName: "Receipt" */ "../Receipt.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Invoice",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default accountPayableInvoiceRoutes;
