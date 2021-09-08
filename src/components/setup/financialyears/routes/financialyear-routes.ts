const FinancialYearRoutes = [
  {
    path: "/manage-financial-years",
    component: () => import("../FinancialYear.vue"),
    meta: { requiresAuth: false, title: "Manage Financial Years" },
  },
];

export default FinancialYearRoutes;
