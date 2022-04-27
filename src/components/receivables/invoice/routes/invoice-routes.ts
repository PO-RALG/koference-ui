import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const invoiceRoutes = [
  {
    path: "/manage-invoices",
    component: () => import(/* webpackChunkName: "Invoice" */ "../Invoice.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Invoice",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default invoiceRoutes;
