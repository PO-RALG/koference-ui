import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const debtorRoutes = [
  {
    path: "manage-invoice-debtors",
    component: () => import(/* webpackChunkName: "InvoiceDebtor" */ "../InvoiceDebtor.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Debtors",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default debtorRoutes;
