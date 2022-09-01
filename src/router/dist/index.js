"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var vue_route_middleware_1 = require("vue-route-middleware");
var dashboard_1 = require("@/components/dashboard");
var user_1 = require("@/components/user");
var role_1 = require("@/components/role");
var gfs_code_1 = require("@/components/coa/gfs-code");
var level_1 = require("@/components/admin-area/level");
var admin_area_1 = require("@/components/admin-area/admin-area");
var financial_year_1 = require("@/components/setup/financial-year");
var fund_type_1 = require("@/components/coa/fund-type");
var gfs_category_1 = require("@/components/coa/gfs-category");
var project_1 = require("@/components/coa/project");
var customer_1 = require("@/components/receivables/customer");
var generic_customer_1 = require("@/components/receivables/generic-customer");
var document_category_1 = require("@/components/setup/document-category");
var document_1 = require("@/components/setup/document");
var funding_source_1 = require("@/components/coa/funding-source");
var sub_budget_class_1 = require("@/components/coa/sub-budget-class");
var bank_account_1 = require("@/components/setup/bank-account");
var facility_type_1 = require("@/components/facility/facility-type");
var menu_1 = require("@/components/menu");
var facility_1 = require("@/components/facility/facility");
var bank_account_type_1 = require("@/components/setup/bank-account-type");
var invoice_item_definition_1 = require("@/components/receivables/invoice-item-definition");
var activity_1 = require("@/components/planning/activity");
var activity_costing_1 = require("@/components/planning/activity-costing");
var invoice_1 = require("@/components/receivables/invoice");
var revenue_projection_1 = require("@/components/planning/revenue-projection");
var supplier_1 = require("@/components/payable/supplier");
var gl_account_1 = require("@/components/general-ledger/gl-account");
var transaction_1 = require("@/components/general-ledger/transaction");
var report_1 = require("@/components/general-ledger/report");
var debtors_1 = require("@/components/receivables/debtors");
var journal_voucher_1 = require("@/components/general-ledger/journal-voucher");
var fund_allocation_1 = require("@/components/payable/fund-allocation");
var voucher_1 = require("@/components/payable/voucher");
var payment_1 = require("@/components/payable/payment");
var report_2 = require("@/components/report");
var creditor_1 = require("@/components/payable/creditor");
var cheque_list_1 = require("@/components/payable/cheque-list");
//import { testRoutes } from "@/components/test";
var bank_reconciliation_1 = require("@/components/cash-management/bank-reconciliation");
var receipt_1 = require("@/components/receivables/receipt");
var approvereversereceipt_1 = require("@/components/receivables/approvereversereceipt");
var voucherapproval_1 = require("@/components/payable/voucherapproval");
var approvereverseinvoice_1 = require("@/components/receivables/approvereverseinvoice");
var stale_cheque_1 = require("@/components/stale-cheque");
var role_2 = require("@/components/approval/role");
var status_1 = require("@/components/approval/status");
var user_2 = require("@/components/approval/user");
var _404_1 = require("@/components/404");
var opening_balance_1 = require("@/components/receivables/opening-balance");
var cashbook_report_1 = require("@/components/cash-management/cashbook-report");
var voucherreversalapproval_1 = require("@/components/payable/voucherreversalapproval");
// import route middlewares
var middleware_1 = require("@/middleware");
var budget_routes_1 = require("@/components/coa/budget/routes/budget-routes");
vue_1["default"].use(vue_router_1["default"]);
var routes = [
    {
        path: "/login",
        component: function () { return Promise.resolve().then(function () { return require("@/components/auth/Login.vue"); }); },
        meta: {
            title: "Login",
            middleware: [middleware_1.setTitle]
        },
        props: function (route) { return ({ query: route.query }); }
    },
    {
        path: "/",
        component: function () { return Promise.resolve().then(function () { return require("@/layouts/Home.vue"); }); },
        meta: {
            requiresAuth: true,
            title: "Dashboard",
            middleware: [middleware_1.setTitle, middleware_1.validateToken, middleware_1.setHeaders, middleware_1.auth]
        },
        children: __spreadArrays(dashboard_1.dashboardRoutes, user_1.userRoutes, financial_year_1.financialYearRoutes, gfs_code_1.gfsCodesRoutes, user_1.userRoutes, level_1.levelRoutes, admin_area_1.adminAreaRoutes, fund_type_1.fundTypesRoutes, gfs_category_1.gfsCategoriesRoutes, project_1.projectRoutes, customer_1.customerRoutes, generic_customer_1.genericCustomerRoutes, document_category_1.documentCategoryRoutes, document_1.documentRoutes, funding_source_1.fundingSourceRoutes, sub_budget_class_1.subBudgetClassRoutes, bank_account_1.bankAccountRoutes, role_1.roleRoutes, facility_type_1.facilityTypeRoutes, menu_1.menuRoutes, facility_1.facilityRoutes, bank_account_type_1.bankAccountTypesRoutes, invoice_item_definition_1.invoiceItemDefinitionRoutes, activity_1.activityRoutes, activity_costing_1.activityCostingRoutes, invoice_1.invoiceRoutes, revenue_projection_1.revenueProjectionRoutes, supplier_1.supplierRoutes, gl_account_1.glAccountRoutes, transaction_1.glTransactionRoutes, report_1.glReportRoutes, debtors_1.debtorRoutes, journal_voucher_1.jvRoutes, fund_allocation_1.fundAllocationRoutes, voucher_1.voucherRoutes, payment_1.paymentRoutes, report_2.reportRoutes, creditor_1.creditorRoutes, cheque_list_1.chequeListRoutes, receipt_1.receiptRoutes, opening_balance_1.openingBalanceRoutes, bank_reconciliation_1.bankReconciliationRoutes, stale_cheque_1.staleChequeRoutes, role_2.approvalRoleRoutes, status_1.approvalStatusRoutes, user_2.approvalUserRoutes, cashbook_report_1.cashbookRoutes, budget_routes_1["default"], approvereversereceipt_1.approveReceiptRoutes, approvereverseinvoice_1.approveInvoiceReversalRoutes, voucherapproval_1.voucherApprovalRoutes, voucherreversalapproval_1.voucherReversalApprovalRoutes, _404_1.notFoundRoute)
    },
];
var router = new vue_router_1["default"]({
    mode: "history",
    base: process.env.BASE_URL,
    routes: routes
});
// middlewares
router.beforeEach(vue_route_middleware_1["default"]({ setTitle: middleware_1.setTitle, validateToken: middleware_1.validateToken, setHeaders: middleware_1.setHeaders, auth: middleware_1.auth }));
exports["default"] = router;
