const activityRoutes = [
  {
    path: "/manage-activities",
    component: () => import("../Activity.vue"),
    meta: { requiresAuth: false, title: "Manage Activities " },
  },
];

export default activityRoutes;
