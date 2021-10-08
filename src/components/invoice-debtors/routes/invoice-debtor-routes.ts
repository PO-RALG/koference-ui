import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const invoiceDebtorsRoutes = [
  {
    path: "manage-invoice-debtors",
    component: () =>
      import(/* webpackChunkName: "InvoiceDebtor" */ "../InvoiceDebtor.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Invoice Debtors",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default invoiceDebtorsRoutes;
