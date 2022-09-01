import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const voucherApprovalRoutes = [
  {
    path: "/payment-vouchers-approval",
    component: () => import("../PaymentVoucherApproval.vue"),
    meta: {
      requiresAuth: true,
      title: "Payment Vouchers",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default voucherApprovalRoutes;
