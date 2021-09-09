const SubBudgetClassRoutes = [
  {
    path: "/manage-sub-budget-classes",
    component: () => import("../SubBudgetClass.vue"),
    meta: { requiresAuth: false, title: "Manage Sub Budget Class" },
  },
];

export default SubBudgetClassRoutes;
