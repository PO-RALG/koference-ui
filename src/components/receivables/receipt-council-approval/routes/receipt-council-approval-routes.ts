import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const receiptCouncilApprovalRoutes = [
  {
    path: "/manage-receipts-council-approval",
    component: () =>
      import(
        /* webpackChunkName: "ReceiptCouncilApproval" */ "../ReceiptCouncilApproval.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Approve Receipt",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default receiptCouncilApprovalRoutes;
