import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import VueRouteMiddleware from "vue-route-middleware";

import { dashboardRoutes } from "@/components/dashboard";
import { userRoutes } from "@/components/user";
import { roleRoutes } from "@/components/role";
import { gfsCodesRoutes } from "@/components/coa/gfs-code";
import { levelRoutes } from "@/components/admin-area/level";
import { adminAreaRoutes } from "@/components/admin-area/admin-area";
import { financialYearRoutes } from "@/components/setup/financial-year";
import { fundTypesRoutes } from "@/components/coa/fund-type";
import { gfsCategoriesRoutes } from "@/components/coa/gfs-category";
import { projectRoutes } from "@/components/coa/project";
import { customerRoutes } from "@/components/receivables/customer";
import { genericCustomerRoutes } from "@/components/receivables/generic-customer";
import { documentCategoryRoutes } from "@/components/setup/document-category";
import { documentRoutes } from "@/components/setup/document";
import { fundingSourceRoutes } from "@/components/coa/funding-source";
import { subBudgetClassRoutes } from "@/components/coa/sub-budget-class";
import { bankAccountRoutes } from "@/components/setup/bank-account";
import { facilityTypeRoutes } from "@/components/facility/facility-type";
import { menuRoutes } from "@/components/menu";
import { facilityRoutes } from "@/components/facility/facility";
import { bankAccountTypesRoutes } from "@/components/setup/bank-account-type";
import { invoiceItemDefinitionRoutes } from "@/components/receivables/invoice-item-definition";
import { activityRoutes } from "@/components/planning/activity";
import { activityCostingRoutes } from "@/components/planning/activity-costing";
import { invoiceRoutes } from "@/components/receivables/invoice";
import { revenueProjectionRoutes } from "@/components/planning/revenue-projection";
import { supplierRoutes } from "@/components/payable/supplier";
import { glAccountRoutes } from "@/components/general-ledger/gl-account";
import { glTransactionRoutes } from "@/components/general-ledger/transaction";
import { glReportRoutes } from "@/components/general-ledger/report";
import { debtorRoutes } from "@/components/receivables/debtors";
import { jvRoutes } from "@/components/general-ledger/journal-voucher";
import { fundAllocationRoutes } from "@/components/payable/fund-allocation";
import { voucherRoutes } from "@/components/payable/voucher";
import { paymentRoutes } from "@/components/payable/payment";
import { reportRoutes } from "@/components/report";
import { creditorRoutes } from "@/components/payable/creditor";
import { chequeListRoutes } from "@/components/payable/cheque-list";
//import { testRoutes } from "@/components/test";
import { bankReconciliationRoutes } from "@/components/cash-management/bank-reconciliation";
import { approvalCouncilRoutes } from "@/components/cash-management/approval-council";
import { receiptRoutes } from "@/components/receivables/receipt";
import { approveReceiptRoutes } from "@/components/receivables/approvereversereceipt";
import { voucherApprovalRoutes } from "@/components/payable/voucherapproval";
import { approveInvoiceReversalRoutes } from "@/components/receivables/approvereverseinvoice";
import { staleChequeRoutes } from "@/components/stale-cheque";
import { approvalRoleRoutes } from "@/components/approval/role";
import { approvalStatusRoutes } from "@/components/approval/status";
import { approvalUserRoutes } from "@/components/approval/user";
import { notFoundRoute } from "@/components/404";
import { openingBalanceRoutes } from "@/components/receivables/opening-balance";
import { bankAdjustmentRoutes } from "@/components/receivables/bank-adjustment";
import { cashbookRoutes } from "@/components/cash-management/cashbook-report";
import { voucherReversalApprovalRoutes } from "@/components/payable/voucherreversalapproval";
import { mmamaPaymentRoutes } from "@/components/payable/mmama-payment";
import { bankAdjustmentCouncilApprovalRoutes } from "@/components/receivables/bank-adjustment-council-approval";
import { receiptCouncilApprovalRoutes } from "@/components/receivables/receipt-council-approval";

// import route middlewares
import { auth, setHeaders, setTitle, validateToken } from "@/middleware";
import budgetRoutes from "@/components/coa/budget/routes/budget-routes";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    component: () => import("@/components/auth/Login.vue"),
    meta: {
      title: "Login",
      middleware: [setTitle],
    },
    props: (route: Route) => ({ query: route.query }),
  },
  {
    path: "/",
    component: () => import("@/layouts/Home.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard",
      middleware: [setTitle, validateToken, setHeaders, auth],
    },
    children: [
      ...dashboardRoutes,
      ...userRoutes,
      ...financialYearRoutes,
      ...gfsCodesRoutes,
      ...userRoutes,
      ...levelRoutes,
      ...adminAreaRoutes,
      ...fundTypesRoutes,
      ...gfsCategoriesRoutes,
      ...projectRoutes,
      ...customerRoutes,
      ...genericCustomerRoutes,
      ...documentCategoryRoutes,
      ...documentRoutes,
      ...fundingSourceRoutes,
      ...subBudgetClassRoutes,
      ...bankAccountRoutes,
      ...roleRoutes,
      ...facilityTypeRoutes,
      ...menuRoutes,
      ...facilityRoutes,
      ...bankAccountTypesRoutes,
      ...invoiceItemDefinitionRoutes,
      ...activityRoutes,
      ...activityCostingRoutes,
      ...invoiceRoutes,
      ...revenueProjectionRoutes,
      ...supplierRoutes,
      ...glAccountRoutes,
      ...glTransactionRoutes,
      ...glReportRoutes,
      ...debtorRoutes,
      ...jvRoutes,
      ...fundAllocationRoutes,
      ...voucherRoutes,
      ...paymentRoutes,
      ...reportRoutes,
      //...testRoutes,
      ...creditorRoutes,
      ...chequeListRoutes,
      ...receiptRoutes,
      ...openingBalanceRoutes,
      ...bankAdjustmentRoutes,
      ...bankReconciliationRoutes,
      ...staleChequeRoutes,
      ...approvalRoleRoutes,
      ...approvalStatusRoutes,
      ...approvalUserRoutes,
      ...cashbookRoutes,
      ...budgetRoutes,
      ...approveReceiptRoutes,
      ...approveInvoiceReversalRoutes,
      ...voucherApprovalRoutes,
      ...voucherReversalApprovalRoutes,
      ...mmamaPaymentRoutes,
      ...bankAdjustmentCouncilApprovalRoutes,
      ...receiptCouncilApprovalRoutes,
      ...approvalCouncilRoutes,
      ...notFoundRoute,
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.VITE_APP_PUBLIC_PATH,
  routes,
});

// middlewares
router.beforeEach(
  VueRouteMiddleware({ setTitle, validateToken, setHeaders, auth })
);

export default router;
