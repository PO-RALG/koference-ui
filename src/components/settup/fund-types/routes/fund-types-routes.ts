const fundTypesRoutes = [
  {
    path: "/fund-types",
    component: () => import("../Fund-types.vue"),
    meta: { requiresAuth: false, title: "Fund Types" },
  },
];

export default fundTypesRoutes;
