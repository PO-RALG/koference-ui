const FundingSourceRoutes = [
  {
    path: "/manage-funding-sources",
    component: () => import("../FundingSource.vue"),
    meta: { requiresAuth: false, title: "Manage Funding Sources" },
  },
];

export default FundingSourceRoutes;
