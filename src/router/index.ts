import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VueRouteMiddleware from "vue-route-middleware";
import store from "@/store";
import { computed } from "@vue/composition-api";

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
import { customersRoutes } from "@/components/setup/customer";
import { documentCategoryRoutes } from "@/components/setup/document-category";
import { documentRoutes } from "@/components/setup/document";
import { fundingSourceRoutes } from "@/components/coa/funding-source";
import { subBudgetClassRoutes } from "@/components/coa/sub-budget-class";
import { bankAccountRoutes } from "@/components/setup/bank-account";
import { facilityTypeRoutes } from "@/components/facility/facility-type";
import { menuRoutes } from "@/components/menu";
import { facilityRoutes } from "@/components/facility/facility";
import { bankAccountTypesRoutes } from "@/components/setup/bank-account-type";
import { invoiceItemDefinitionRoutes } from "@/components/setup/invoice-item-definition";
import { activityRoutes } from "@/components/planning/activity";
import { activityCostingRoutes } from "@/components/planning/activity-costing";
import { invoiceRoutes } from "@/components/invoice";
import { revenueProjectionRoutes } from "@/components/planning/revenue-projection";
import { supplierRoutes } from "@/components/payable/supplier";
import { glAccountRoutes } from "@/components/general-ledger/gl-account";
import { glTransactionRoutes } from "@/components/general-ledger/transaction";
import { glReportRoutes } from "@/components/general-ledger/report";
import { invoiceDebtorsRoutes } from "@/components/invoice-debtors";
import { jvRoutes } from "@/components/general-ledger/journal-voucher";
import { fundAllocationRoutes } from "@/components/payable/fund-allocation";
import { paymentVoucherRoutes } from "@/components/payable/payment-voucher";
import { paymentRoutes } from "@/components/payable/payment";
import { reportRoutes } from "@/components/report";
 import { testRoutes } from "@/components/test";
import { creditorRoutes } from "@/components/payable/creditor";
import { chequeListRoutes } from "@/components/payable/cheque-list";
import { notFoundRoute } from "@/components/404";

// import route middlewares
import { setTitle, validateToken, setHeaders, auth } from "@/middleware";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    component: () => import("@/components/auth/Login.vue"),
    meta: {
      title: "Login",
      middleware: [setTitle],
    },
    props: (route) => ({ query: route.query }),
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
      ...customersRoutes,
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
      ...invoiceDebtorsRoutes,
      ...jvRoutes,
      ...fundAllocationRoutes,
      ...paymentVoucherRoutes,
      ...paymentRoutes,
      ...reportRoutes,
       ...testRoutes,
      ...creditorRoutes,
      ...chequeListRoutes,
      ...notFoundRoute,
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});


// middlewares
const isLoggedIn = (to, _, next) => {
  const loginStatus = store.getters["Auth/getLoginStatus"];
  const loggedIn = loginStatus ? loginStatus.isLoggedIn : false;
  const currentUser = store.getters["Auth/getCurrentUser"];

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (loggedIn && currentUser) {
      console.log("user is logged in");
      next();
    } else {
      console.log("redirect to login page");
    }
  } else {
    next();
  }
};

router.beforeEach(VueRouteMiddleware({ setTitle, validateToken, setHeaders, auth }));

export default router;
