import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const approveReceiptRoutes = [
  {
    path: "/manage-approve-reversal-receipts",
    component: () =>
      import(
        /* webpackChunkName: "ApproveReversalReceipt" */ "../ApproveReversalReceipt.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Approve Receipt",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default approveReceiptRoutes;
