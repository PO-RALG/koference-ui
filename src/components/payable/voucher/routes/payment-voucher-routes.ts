import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const voucherRoutes = [
  {
    path: "/payment-vouchers",
    component: () => import("../PaymentVoucher.vue"),
    meta: {
      requiresAuth: true,
      title: "Payment Vouchers",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default voucherRoutes;
