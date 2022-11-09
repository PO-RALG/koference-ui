import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

const bankAdjustmentCouncilApprovalRoutes = [
  {
    // path: "/manage-bank-adjustment-council-approval",
    path: "",
    component: () =>
      import(
        /* webpackChunkName: "BankAdjustmentCouncilApprove" */ "../BankAdjustmentCouncilApprove.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Bank Adjustment Council Approval",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
  },
];

export default bankAdjustmentCouncilApprovalRoutes;
