const FinancialYearRoutes = [
  {
    path: "/manage-finacial-years",
    component: () => import("../FinancialYear.vue"),
    meta: { requiresAuth: false, title: "Manage Financial Years" },
  },
];

export default FinancialYearRoutes;
