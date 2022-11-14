import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const paymentCouncilApprovalRoutes = [
  {
    // path: "/manage-payments-council-approval",
    path: "",
    component: () => import("../PaymentCouncilApproval.vue"),
    meta: {
      requiresAuth: true,
      title: "Manage Payments Council Approval",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default paymentCouncilApprovalRoutes;
