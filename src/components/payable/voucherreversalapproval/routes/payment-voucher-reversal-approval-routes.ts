import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const voucherReversalApprovalRoutes = [
  {
    path: "/payment-vouchers-reversal-approval",
    component: () => import("../PaymentVoucherReversalApproval.vue"),
    meta: {
      requiresAuth: true,
      title: "Payment Vouchers",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default voucherReversalApprovalRoutes;
