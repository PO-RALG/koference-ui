import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const approveInvoiceReversalRoutes = [
  {
    path: "/manage-approve-reversal-invoices",
    component: () =>
      import(/* webpackChunkName: "Invoice" */ "../ApproveInvoiceReversal.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Approve Invoice Reversal",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default approveInvoiceReversalRoutes;
