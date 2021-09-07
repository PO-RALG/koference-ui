const fundTypesRoutes = [
  {
    path: "/manage-fund-types",
    component: () => import("../FundTypes.vue"),
    meta: { requiresAuth: false, title: "Fund Types" },
  },
];

export default fundTypesRoutes;
