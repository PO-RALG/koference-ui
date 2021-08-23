const userRoutes = [
  {
    path: "/manage-users",
    component: () => import("../UserComponent.vue"),
    meta: { requiresAuth: false, title: "Manage Users" },
  },
];

export default userRoutes;
