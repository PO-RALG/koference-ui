import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const invoiceCouncilApprovalRoutes = [
  {
    // path: "/manage-invoices-council-approval",
    path: "",
    component: () =>
      import(
        /* webpackChunkName: "InvoiceCouncilApproval" */ "../InvoiceCouncilApproval.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Manage Invoice Council Approval",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default invoiceCouncilApprovalRoutes;
