const userRoutes = [
  {
    path: "/manage-users",
    component: () => import("../User.vue"),
    meta: { requiresAuth: false, title: "Manage Users" },
  },
];

export default userRoutes;
